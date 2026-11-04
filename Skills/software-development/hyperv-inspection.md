---
name: hyperv-inspection
description: "Hyper-V host and VM inspection via PowerShell — check CPU, RAM, NUMA, Generation, Dynamic Memory, disk config, and network."
version: 1.0.0
author: Hermes Agent
platforms: [windows]
---

# Hyper-V Inspection

Skill for inspecting Microsoft Hyper-V hosts and VMs to identify misconfigurations and optimization opportunities.

## User Preference

- **GUI first**: When both Hyper-V Manager GUI and PowerShell approaches exist for a task, provide the GUI instructions first. PowerShell can be a secondary option or for bulk operations.
- **Production safety**: Never suggest MBR→GPT conversion, Gen2 migration, or disk edits without first recommending a VHDX copy + test approach. Production data safety > performance gains.

## Quick Reference — Data Collection

All commands run in **PowerShell as Administrator** on the Hyper-V host.

### Host Hardware

```powershell
# CPU
Get-WmiObject -Class Win32_Processor |
    Select-Object SocketDesignation, Name, MaxClockSpeed, NumberOfCores, NumberOfLogicalProcessors

# RAM + Sockets
$cs = Get-CimInstance Win32_ComputerSystem
"RAM Total: $([math]::Round($cs.TotalPhysicalMemory/1GB,1)) GB"
"RAM Livre: $([math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB,1)) GB"
"Sockets: $($cs.NumberOfProcessors)"
"Núcleos lógicos: $($cs.NumberOfLogicalProcessors)"
```

### VM List (compact)

```powershell
Get-VM | Select-Object Name, State, ProcessorCount, Generation,
@{N='RAM_Start(MB)';E={$_.MemoryStartup/1MB}},
@{N='RAM_Max(MB)';E={$_.MemoryMaximum/1MB}},
@{N='RAM_Min(MB)';E={$_.MemoryMinimum/1MB}},
DynamicMemoryEnabled | Format-Table
```

### VM CPU / NUMA details

```powershell
Get-VM | ForEach-Object {
    $cpu = Get-VMProcessor -VM $_
    Write-Host "--- $($_.Name) ---"
    Write-Host "  vCPUs: $($cpu.Count)"
    Write-Host "  CompatibilityMode: $($cpu.CompatibilityForMigrationEnabled)"
    Write-Host "  ExposeVirtualizationExtensions: $($cpu.ExposeVirtualizationExtensions)"
    Write-Host "  NUMA (EnableHostResourceProtection): $($cpu.EnableHostResourceProtection)"
}
```

### VM Disks

```powershell
Get-VM | ForEach-Object {
    Write-Host "--- $($_.Name) ---"
    Get-VMHardDiskDrive -VM $_ |
        Select-Object ControllerType, ControllerNumber,
            @{N='Path';E={$_.Path.Split('\')[-1]}},
            @{N='Size(GB)';E={[math]::Round($_.DiskSize/1GB,2)}} | Format-Table
}
```

### VM Network

```powershell
Get-VM | ForEach-Object {
    Write-Host "--- $($_.Name) ---"
    Get-VMNetworkAdapter -VM $_ |
        Select-Object Name, SwitchName, MacAddress,
            @{N='IP(s)';E={($_.IPAddresses -join ', ')}} | Format-Table
}
```

## Analysis Checklist

### 1. VM Generation

| Gen1 (BIOS) | Gen2 (UEFI) |
|---|---|
| BIOS legado | UEFI, Secure Boot, vTPM |
| IDE + SCSI | SCSI / NVMe only |
| Max 64 vCPUs | Up to 240 vCPUs |
| Max 1 TB RAM | Up to 12 TB RAM |
| ❌ **Legacy — migrate to Gen2** | ✅ **Recommended** |

**Gen2 migration:** Create new Gen2 VM, attach same VHDX, boot. No data loss.

**OS compatibility:**
- Windows Server 2008/2008R2 — Gen1 only
- Windows Server 2012R2+ — Gen2 ✅
- Windows 8+ — Gen2 ✅
- Ubuntu 18.04+ — Gen2 ✅ (disable Secure Boot)
- Debian 8+ — Gen2 ✅

### 2. NUMA

- **Host with 2+ sockets** → NUMA should be enabled on VMs with >8 GB RAM
- Requires VM restart to take effect
- Without NUMA: VM may allocate all RAM on one socket, wasting the other
- **NUMA activation is NOT "Enable host resource protection"** — that's a different feature (protects host from runaway VMs).

**NUMA GUI path (Hyper-V Manager):**
1. VM → **Settings → Processor** → expand the **NUMA** section (bottom of Processor pane)
2. **Select "Usar topologia de hardware"** (this is a selection option, NOT a checkbox)
3. Leave all sub-fields **blank** (Maximum Processors, Maximum Memory, Max NUMA nodes per socket, etc.)
4. Click **OK**

**NUMA section options explained:**
| Option | Meaning | Recommended |
|--------|---------|:-----------:|
| Usar topologia de hardware | Auto-detect host NUMA layout | ✅ **SELECT THIS** |
| Número máximo de processadores | Max vCPUs per NUMA node | Leave blank |
| Quantidade máxima de memória | Max RAM per NUMA node | Leave blank |
| Nº máximo de nós em um único soquete | Max NUMA nodes per CPU socket | Leave blank |
| Nº máximo de nós NUMA permitidos no soquete | Same (duplicate in UI) | Leave blank |
| Nº de threads de hardware | Expose Hyper-Threading | Leave blank |

**PowerShell (alternative):**
```powershell
# Enable NUMA on one VM
Set-VMProcessor -VMName "VM-NAME" -EnableHostResourceProtection $true

# Enable NUMA on all stopped VMs at once
Get-VM | Where-Object {$_.State -eq "Off"} | ForEach-Object {
    Set-VMProcessor -VM $_ -EnableHostResourceProtection $true
    Write-Host "$($_.Name): NUMA enabled"
}
```

**IMPORTANT — NUMA + Dynamic Memory limit:** When both are enabled, `MemoryMaximum` must not exceed the RAM of a single host NUMA node. Check per-node RAM:
```powershell
Get-VMHostNumaNode | Select-Object NodeId,
    @{N='RAM_Total(GB)';E={[math]::Round($_.MemoryAvailable/1GB,1)}},
    ProcessorPackage
```

### 3. Dynamic Memory

- **Startup RAM =** what the VM boots with
- **Min RAM =** floor (Hyper-V won't reclaim below this)
- **Max RAM =** ceiling (VM can grow up to this if needed)
- **Enabled** → Hyper-V can reclaim unused RAM from VMs back to host
- **Disabled** → VM holds all Startup RAM forever, even when idle

### 4. Disk Controller

| Controller | Use | Notes |
|---|---|---|
| IDE | ❌ Legacy | Slower, limited features |
| SCSI | ✅ Recommended | Modern, fast, virtio-scsi equivalent |
| NVMe | ✅ Best | Gen2 only, fastest |

- IDE → SCSI: requires VM to be stopped, disk detached and reattached. OS needs driver (built-in on Win 2012R2+ / modern Linux).

### 5. CPU Compatibility

- `CompatibilityForMigrationEnabled` = **False** is correct for performance
- When True: limits CPU features to a baseline set (good for live migration between different CPU models, but loses SSE4.x, AVX, etc.)

### 6. Over-commitment

**vCPU ratio:** Host has N logical cores. Each VM vCPU adds to total.  
- If Total vCPUs ≤ N: no over-commitment
- If Total vCPUs > N: Hyper-V schedules time-slices (fine for idle VMs, bad for busy ones)

**RAM check:**
- Sum(VMs RAM) ≤ Host RAM? If not, host is over-committed and may swap.
- Dynamic Memory helps reduce waste.

## Best-Practices by Scenario

### 1. Windows Server (SQL, Arquivos, AD)
| Config | Recommended | Why |
|--------|-------------|-----|
| Generation | **Gen2** | UEFI, Secure Boot, NVMe |
| vCPUs | 4-8 | Avoid over-commitment |
| RAM | **Dynamic Memory ON** | Host recycles unused RAM |
| Disk | **SCSI / NVMe** | IDE is bottleneck |
| NUMA | ✅ **ON** | Essential on 2+ socket hosts |

**RAM for Windows workloads:**
| Workload | Startup | Min | Max |
|----------|---------|-----|-----|
| AD/DC | 8 GB | 4 GB | 12 GB |
| File Server | 16 GB | 8 GB | 32 GB |
| Small SQL | 16 GB | 8 GB | 32 GB |
| Heavy SQL/ERP | 32 GB | 16 GB | 64 GB |

### 2. Linux (Ubuntu, Debian)
| Config | Recommended | Why |
|--------|-------------|-----|
| Generation | **Gen2** | Modern Linux supports UEFI |
| Secure Boot | **OFF** (for Linux) | Prevents boot otherwise |
| vCPUs | 4-6 | Sufficient for most services |
| RAM | **Dynamic Memory ON** | Linux + KSM works well |
| Disk | **SCSI** | Built-in Linux drivers |

**RAM for Linux workloads:**
| Workload | Startup | Min | Max |
|----------|---------|-----|-----|
| Web/Proxy | 4 GB | 2 GB | 8 GB |
| DB (MySQL/PG) | 16 GB | 8 GB | 32 GB |
| Docker/Containers | 16 GB | 8 GB | 32 GB |

### 3. Mixed / Isolated Network
| Config | Recommended |
|--------|-------------|
| Generation | **Gen2** |
| NUMA | **ON** |
| vCPUs | 8-10 |
| RAM | Dynamic Memory with realistic max |

## Reference Files

- `references/sooretama-hyperv-audit.md` — audited config of Prefeitura Sooretama Hyper-V host (10.0.0.2) with 2× Xeon Silver 4114, 512 GB RAM, 5 VMs.

## Common Problems

| Symptom | Likely Cause |
|---|---|
| VM reports missing CPU features | Gen1 + CompatibilityMode on host CPU with AVX/SSE4 |
| Slow disk performance | IDE controller or `directsync` cache mode (Proxmox) |
| VM runs fine but host shows RAM pressure | Too many fixed-RAM VMs, no Dynamic Memory |
| Cannot boot after Gen2 migration | Secure Block (disable it for Linux) or OS too old |
| VM uses only half the host CPU power | NUMA disabled on multi-socket host |
