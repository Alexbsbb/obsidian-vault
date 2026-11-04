---
tags: [antigravity-conversa]
data: ""
steps: 388
fonte: Antigravity
---

# Sem título

> Crie uma aplicação desktop em Python com interface gráfica moderna para gerar QR Codes de localização integrados ao Google Maps.


## Mensagens do usuário

Crie uma aplicação desktop em Python com interface gráfica moderna para gerar QR Codes de localização integrados ao Google Maps.

Objetivo do sistema:
O usuário digita um endereço, a aplicação pesquisa e exibe o local em um mapa interativo. O usuário pode ajustar/mover o marcador exatamente para o ponto desejado. Após confirmar a localização, o sistema gera um QR Code que, ao ser escaneado por qualquer celular, abre diretamente o local no Google Maps.

Requisitos principais:

Linguagem: Python
Interface gráfica moderna e responsiva
Permitir digitar:
Rua
Número
Bairro
Cidade
Estado
CEP
Também aceitar endereço completo em um único campo

Funcionalidades:

Pesquisa de Endereço
Converter endereço em coordenadas (latitude e longitude)
Utilizar geocodificação
Exibir resultado automaticamente no mapa
Mapa Interativo
Exibir mapa embutido na aplicação
Permitir:
Zoom
Arrastar mapa
Mover marcador manualmente
Atualizar coordenadas em tempo real
O usuário deve conseguir clicar no mapa para alterar a localização
Geração do Link
Após confirmar a posição:
Gerar link compatível com Google Maps no formato:
https://maps.google.com/?q=LATITUDE,LONGITUDE
Geração do QR Code
Gerar QR Code automaticamente usando o link do Google Maps
Mostrar pré-visualização do QR Code
Permitir:
Salvar PNG
Copiar imagem
Exportar em alta qualidade
Histórico
Salvar últimos QR Codes gerados
Mostrar:
Endereço
Coordenadas
Data
Miniatura do QR Code
Interface
Tema moderno
Modo escuro
Layout profissional
Compatível com Windows
Tecnologias recomendadas
Utilize:
customtkinter ou PySide6
folium ou tkintermapview para o mapa
qrcode para geração do QR Code
geopy para geocodificação
Pillow para imagens
Estrutura esperada
O projeto deve ser organizado em:
main.py
interface/
services/
maps/
qrcode/
storage/
assets/
Recursos extras desejados
Botão “Abrir no Google Maps”
Botão “Compartilhar”
Exportar PDF com QR Code e endereço
Detectar automaticamente coordenadas ao mover marcador
Mostrar latitude e longitude em tempo real
Sistema pronto para gerar executável .exe
Resultado esperado
Fluxo ideal:
Usuário digita endereço
Sistema mostra no mapa
Usuário ajusta marcador
Sistema gera QR Code
Ao escanear, o celular abre diretamente o Google Maps naquela localização

O código deve ser completo, funcional, organizado, moderno e pronto para produção.
Implemente tratamento de erros, comentários importantes e arquitetura limpa.
faça
nem abre
ta file, mas pode colcoar a opção do mapa em satelite tambem?
e a opção de seleciona o local no mapa
