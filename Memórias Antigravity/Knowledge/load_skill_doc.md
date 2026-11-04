# Load Skill Script

**Localização:** `E:\.agents\Skills\load_skill.txt`  
**Tipo:** Script Python  
**Propósito:** Carregar o conteúdo de qualquer skill pelo nome

## Código Completo

```python
import os
import sys

def load_skill(skill_name):
    # Caminho base: e:\.agents\Skills\skills
    base_path = r"e:\.agents\Skills\skills"
    
    possible_extensions = ['.md', '.json', '.txt', 'SKILL.md']
    
    skill_content = None
    found_path = None

    # Verifica se skill_name é um diretório e busca SKILL.md nele
    skill_dir = os.path.join(base_path, skill_name)
    if os.path.isdir(skill_dir):
        possible_files = ['SKILL.md', 'index.md', 'README.md']
        for pf in possible_files:
            p = os.path.join(skill_dir, pf)
            if os.path.exists(p):
                found_path = p
                break
    
    if not found_path:
        for ext in possible_extensions:
            # Tenta caminho direto: skills/nome_da_skill.md
            path = os.path.join(base_path, f"{skill_name}{ext}")
            if os.path.exists(path):
                found_path = path
                break
            
            # Tenta subpasta: skills/nome_da_skill/index.md
            path_sub = os.path.join(base_path, skill_name, f"index{ext}")
            if os.path.exists(path_sub):
                found_path = path_sub
                break

    if found_path:
        try:
            with open(found_path, 'r', encoding='utf-8') as f:
                skill_content = f.read()
            return f"--- CONTEÚDO DA SKILL {skill_name} ---\n{skill_content}"
        except Exception as e:
            return f"Erro ao ler a skill: {str(e)}"
    else:
        return f"Skill '{skill_name}' não encontrada no diretório {base_path}."

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(load_skill(sys.argv[1]))
    else:
        print("Uso: python load_skill.py <nome_da_skill>")
```

## Como usar

```bash
python load_skill.py docker-expert
python load_skill.py rails-upgrade
python load_skill.py ruby-pro
```

## Lógica de Busca (ordem)

1. Verifica se `skill_name` é uma pasta → busca `SKILL.md`, `index.md`, `README.md`
2. Tenta `skills/{nome}.md`, `.json`, `.txt`, `SKILL.md`
3. Tenta `skills/{nome}/index.md`, `index.json`, etc.

## Caminho Base

```
e:\.agents\Skills\skills\
```
*(diferente do projeto Chatwoot em `e:\chatwoot\chatwoot-develop\.agents\skills\`)*
