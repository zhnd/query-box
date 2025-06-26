import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export const githubLightTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    {
      foreground: '6e7781',
      token: 'comment',
    },
    {
      foreground: '6e7781',
      token: 'punctuation.definition.comment',
    },
    {
      foreground: '6e7781',
      token: 'string.comment',
    },
    {
      foreground: '0550ae',
      token: 'constant',
    },
    {
      foreground: '0550ae',
      token: 'entity.name.constant',
    },
    {
      foreground: '0550ae',
      token: 'variable.other.constant',
    },
    {
      foreground: '0550ae',
      token: 'variable.language',
    },
    {
      foreground: '0550ae',
      token: 'entity',
    },
    {
      foreground: '953800',
      token: 'entity.name',
    },
    {
      foreground: '1f2328',
      token: 'variable.parameter.function',
    },
    {
      foreground: '116329',
      token: 'entity.name.tag',
    },
    {
      foreground: 'cf222e',
      token: 'keyword',
    },
    {
      foreground: 'cf222e',
      token: 'storage',
    },
    {
      foreground: 'cf222e',
      token: 'storage.type',
    },
    {
      foreground: '1f2328',
      token: 'storage.modifier.package',
    },
    {
      foreground: '1f2328',
      token: 'storage.modifier.import',
    },
    {
      foreground: '1f2328',
      token: 'storage.type.java',
    },
    {
      foreground: '0a3069',
      token: 'string',
    },
    {
      foreground: '0a3069',
      token: 'string punctuation.section.embedded source',
    },
    {
      foreground: '0550ae',
      token: 'support',
    },
    {
      foreground: '0550ae',
      token: 'meta.property-name',
    },
    {
      foreground: '953800',
      token: 'variable',
    },
    {
      foreground: '1f2328',
      token: 'variable.other',
    },
    {
      foreground: '82071e',
      fontStyle: 'italic',
      token: 'invalid.broken',
    },
    {
      foreground: '82071e',
      fontStyle: 'italic',
      token: 'invalid.deprecated',
    },
    {
      foreground: '82071e',
      fontStyle: 'italic',
      token: 'invalid.illegal',
    },
    {
      foreground: 'f6f8fa',
      background: 'cf222e',
      fontStyle: 'italic underline',
      token: 'carriage-return',
    },
    {
      foreground: '82071e',
      fontStyle: 'italic',
      token: 'invalid.unimplemented',
    },
    {
      foreground: '82071e',
      token: 'message.error',
    },
    {
      foreground: '0550ae',
      token: 'string variable',
    },
    {
      foreground: '0a3069',
      token: 'source.regexp',
    },
    {
      foreground: '0a3069',
      token: 'string.regexp',
    },
    {
      foreground: '0a3069',
      token: 'string.regexp.character-class',
    },
    {
      foreground: '0a3069',
      token: 'string.regexp constant.character.escape',
    },
    {
      foreground: '0a3069',
      token: 'string.regexp source.ruby.embedded',
    },
    {
      foreground: '0a3069',
      token: 'string.regexp string.regexp.arbitrary-repitition',
    },
    {
      foreground: '116329',
      fontStyle: 'bold',
      token: 'string.regexp constant.character.escape',
    },
    {
      foreground: '0550ae',
      token: 'support.constant',
    },
    {
      foreground: '0550ae',
      token: 'support.variable',
    },
    {
      foreground: '0550ae',
      token: 'meta.module-reference',
    },
    {
      foreground: '0550ae',
      fontStyle: 'bold',
      token: 'markup.heading',
    },
    {
      foreground: '0550ae',
      fontStyle: 'bold',
      token: 'markup.heading entity.name',
    },
    {
      foreground: '116329',
      token: 'markup.quote',
    },
    {
      foreground: '1f2328',
      fontStyle: 'italic',
      token: 'markup.italic',
    },
    {
      foreground: '1f2328',
      fontStyle: 'bold',
      token: 'markup.bold',
    },
    {
      foreground: '82071e',
      background: 'ffebe9',
      token: 'markup.deleted',
    },
    {
      foreground: '82071e',
      background: 'ffebe9',
      token: 'meta.diff.header.from-file',
    },
    {
      foreground: '82071e',
      background: 'ffebe9',
      token: 'punctuation.definition.deleted',
    },
    {
      foreground: '116329',
      background: 'dafbe1',
      token: 'markup.inserted',
    },
    {
      foreground: '116329',
      background: 'dafbe1',
      token: 'meta.diff.header.to-file',
    },
    {
      foreground: '116329',
      background: 'dafbe1',
      token: 'punctuation.definition.inserted',
    },
    {
      foreground: '953800',
      background: 'ffd8b5',
      token: 'markup.changed',
    },
    {
      foreground: '953800',
      background: 'ffd8b5',
      token: 'punctuation.definition.changed',
    },
    {
      foreground: 'eaeef2',
      background: '0550ae',
      token: 'markup.ignored',
    },
    {
      foreground: 'eaeef2',
      background: '0550ae',
      token: 'markup.untracked',
    },
    {
      foreground: '8250df',
      fontStyle: 'bold',
      token: 'meta.diff.range',
    },
    {
      foreground: '0550ae',
      token: 'meta.diff.header',
    },
    {
      foreground: '0550ae',
      fontStyle: 'bold',
      token: 'meta.separator',
    },
    {
      foreground: '0550ae',
      token: 'meta.output',
    },
    {
      foreground: '57606a',
      token: 'brackethighlighter.tag',
    },
    {
      foreground: '57606a',
      token: 'brackethighlighter.curly',
    },
    {
      foreground: '57606a',
      token: 'brackethighlighter.round',
    },
    {
      foreground: '57606a',
      token: 'brackethighlighter.square',
    },
    {
      foreground: '57606a',
      token: 'brackethighlighter.angle',
    },
    {
      foreground: '57606a',
      token: 'brackethighlighter.quote',
    },
    {
      foreground: '82071e',
      token: 'brackethighlighter.unmatched',
    },
    {
      foreground: '0a3069',
      fontStyle: 'underline',
      token: 'constant.other.reference.link',
    },
    {
      foreground: '0a3069',
      fontStyle: 'underline',
      token: 'string.other.link',
    },
  ],
  colors: {
    focusBorder: '#0969da',
    foreground: '#1f2328',
    descriptionForeground: '#656d76',
    errorForeground: '#cf222e',
    'textLink.foreground': '#0969da',
    'textLink.activeForeground': '#0969da',
    'textBlockQuote.background': '#f6f8fa',
    'textBlockQuote.border': '#d0d7de',
    'textCodeBlock.background': '#afb8c133',
    'textPreformat.foreground': '#656d76',
    'textPreformat.background': '#afb8c133',
    'textSeparator.foreground': '#d8dee4',
    'icon.foreground': '#656d76',
    'keybindingLabel.foreground': '#1f2328',
    'input.background': '#ffffff',
    'input.border': '#d0d7de',
    'input.foreground': '#1f2328',
    'input.placeholderForeground': '#6e7781',
    'badge.foreground': '#ffffff',
    'badge.background': '#0969da',
    'quickInput.foreground': '#1f2328',
    'editor.foreground': '#1f2328',
    'editor.background': '#ffffff',
    'editorWidget.background': '#ffffff',
    'editor.foldBackground': '#6e77811a',
    'editor.lineHighlightBackground': '#eaeef280',
    'editorLineNumber.foreground': '#8c959f',
    'editorLineNumber.activeForeground': '#1f2328',
    'editorIndentGuide.background': '#1f23281f',
    'editorIndentGuide.activeBackground': '#1f23283d',
    'editorWhitespace.foreground': '#afb8c1',
    'editorCursor.foreground': '#0969da',
    'editor.findMatchBackground': '#bf8700',
    'editor.findMatchHighlightBackground': '#fae17d80',
    'editor.linkedEditingBackground': '#0969da12',
    'editor.selectionHighlightBackground': '#4ac26b40',
    'editor.wordHighlightBackground': '#eaeef280',
    'editor.wordHighlightBorder': '#afb8c199',
    'editor.wordHighlightStrongBackground': '#afb8c14d',
    'editor.wordHighlightStrongBorder': '#afb8c199',
    'editorBracketMatch.background': '#4ac26b40',
    'editorBracketMatch.border': '#4ac26b99',
    'editorInlayHint.background': '#afb8c133',
    'editorInlayHint.foreground': '#656d76',
    'editorInlayHint.typeBackground': '#afb8c133',
    'editorInlayHint.typeForeground': '#656d76',
    'editorInlayHint.paramBackground': '#afb8c133',
    'editorInlayHint.paramForeground': '#656d76',
    'editorOverviewRuler.border': '#ffffff',
    'editorBracketHighlight.foreground1': '#0969da',
    'editorBracketHighlight.foreground2': '#1a7f37',
    'editorBracketHighlight.foreground3': '#9a6700',
    'editorBracketHighlight.foreground4': '#cf222e',
    'editorBracketHighlight.foreground5': '#bf3989',
    'editorBracketHighlight.foreground6': '#8250df',
    'editorBracketHighlight.unexpectedBracket.foreground': '#656d76',
    'editor.stackFrameHighlightBackground': '#d4a72c66',
    'editor.focusedStackFrameHighlightBackground': '#4ac26b66',
    'editorCodeLens.foreground': '#656d76',
    'editorLink.activeForeground': '#656d76',
  },
}
