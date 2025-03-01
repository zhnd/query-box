import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

// GitHub Light theme color definitions aligned with your schema
const base00 = "#fff", // Background
  base01 = "#24292e", // Foreground
  base02 = "#BBDFFF", // Selection and Selection Match
  base03 = "#6e7781", // Gutter Foreground
  base04 = "#f6f8fa", // Caret, using Foreground color
  base05 = "#116329", // TagName and Standard TagName
  base06 = "#6a737d", // Comment and Bracket
  base07 = "#6f42c1", // ClassName and PropertyName
  base08 = "#005cc5", // VariableName, AttributeName, Number, Operator
  base09 = "#d73a49", // Keyword, TypeName, TypeOperator
  base0A = "#032f62", // String, Meta, Regexp
  base0B = "#22863a", // Name, Quote
  base0C = "#e36209", // Atom, Bool, Special VariableName
  base0D = "#b31d28", // Deleted
  base0E = "#ffeef0", // Background for Deleted
  invalid = "#cb2431"; // Invalid color

const darkBackground = base04, // A lighter background for panels, assuming a light theme variant
  highlightBackground = base02 + "20", // Adding opacity for highlight
  tooltipBackground = base00,
  cursor = base01,
  selection = base02;

// Define the editor theme styles for GitHub Light.
export const githubLightTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      color: base01,
      backgroundColor: base00,
    },
    ".cm-content": {
      caretColor: cursor,
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: cursor,
    },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: selection,
      },
    ".cm-searchMatch": {
      backgroundColor: base02,
      outline: `1px solid ${base03}`,
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: base05,
      color: base07,
    },
    ".cm-panels": {
      backgroundColor: darkBackground,
      color: base03,
    },
    ".cm-panels.cm-panels-top": {
      borderBottom: "2px solid black",
    },
    ".cm-panels.cm-panels-bottom": {
      borderTop: "2px solid black",
    },
    ".cm-activeLine": {
      backgroundColor: highlightBackground,
    },
    ".cm-gutters": {
      backgroundColor: base00,
      color: base03,
    },
    ".cm-tooltip": {
      backgroundColor: tooltipBackground,
    },
  },
  { dark: false }
);

// Define the highlighting style for code in the GitHub Light theme.
export const githubLightHighlightStyle = HighlightStyle.define([
  { tag: [t.standard(t.tagName), t.tagName], color: base05 },
  { tag: [t.comment, t.bracket], color: base06 },
  { tag: [t.className, t.propertyName], color: base07 },
  {
    tag: [t.variableName, t.attributeName, t.number, t.operator],
    color: base08,
  },
  { tag: [t.keyword, t.typeName, t.typeOperator], color: base09 },
  { tag: [t.string, t.meta, t.regexp], color: base0A },
  { tag: [t.name, t.quote], color: base0B },
  { tag: [t.heading, t.strong], color: base01, fontWeight: "bold" },
  { tag: [t.emphasis], color: base01, fontStyle: "italic" },
  { tag: [t.deleted], color: base0D, backgroundColor: base0E },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: base0C },
  { tag: [t.url, t.escape, t.regexp, t.link], color: base0A },
  { tag: t.link, textDecoration: "underline" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.invalid, color: invalid },
]);

// Extension to enable the GitHub Light theme (both the editor theme and the highlight style).
export const githubLight: Extension = [
  githubLightTheme,
  syntaxHighlighting(githubLightHighlightStyle),
];
