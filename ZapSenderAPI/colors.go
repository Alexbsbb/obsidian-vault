package main

// ZapSender Theme Colors
// Design: Orange (#FF6B18) & Black (#0B0B0D)

const (
	// Primary brand color - Orange accent
	ColorPrimary = "#FF6B18" // Laranja vibrante (ZapSender)

	// Background color - Dark Black
	ColorBackground = "#0B0B0D" // Preto profundo com tom âmbar

	// Text colors
	ColorTextWhite = "#FFFFFF" // Branco puro
	ColorTextGray  = "#A1A1AA" // Cinza secundário

	// Button colors
	ColorButtonPrimary = "#FF6B18" // Botão laranja
	ColorButtonHover   = "#E55A0D" // Laranja mais escuro (hover)

	// Accent colors
	ColorAccent = "#FF6B18" // Laranja destaque
)

// Theme configuration
type Theme struct {
	Primary    string
	Background string
	TextWhite  string
	TextGray   string
	Button     string
	ButtonHover string
	Accent     string
}

// ZapSenderTheme returns the official ZapSender color theme
func ZapSenderTheme() Theme {
	return Theme{
		Primary:     ColorPrimary,
		Background:  ColorBackground,
		TextWhite:   ColorTextWhite,
		TextGray:    ColorTextGray,
		Button:      ColorButtonPrimary,
		ButtonHover: ColorButtonHover,
		Accent:      ColorAccent,
	}
}