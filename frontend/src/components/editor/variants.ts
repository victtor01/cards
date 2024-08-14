import { Mark, mergeAttributes } from "@tiptap/core";
// import { Command, EditorState } from "@tiptap/pm/state";
// import { Commands, Editor } from "@tiptap/react";

export const CustomSpan = Mark.create({
  name: "categorize",

  addAttributes() {
    return {
      class: {
        parseHTML: (element: any) => element.getAttribute("class"),
        renderHTML: (attributes: any) => {
          return { class: attributes.class };
        },
      },
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          return { id: attributes.id };
        },
      },
    };
  },

  // parseHTML() {
  //   return [
  //     {
  //       tag: "span.custom-class",
  //     },
  //   ];
  // },

  renderHTML({ HTMLAttributes }: any) {
    return ["span", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      markWord:
        () =>
        ({ commands, state }: any) => {
          const { from, to } = state.selection;
          const isActive = state.doc.rangeHasMark(from, to, state.schema.marks.categorize);

          if (isActive) {
            return commands.unsetMark("categorize", {
              class:
                "category bg-indigo-600 shadow-lg shadow:shadow-black p-1 rounded text-white",
            });
          } else {
            return commands.setMark("categorize", {
              class:
                "category bg-indigo-600 shadow-lg shadow:shadow-black p-1 rounded text-white",
            });
          }
        },
    };
  },
});

// ({ commands, state, chain }: { commands: any, state: any, chain: any }) => {
//   // Verifica se o texto selecionado já tem a marcação
//   const isActive = state.selection.$from.marks().some((mark) => mark.type.name === 'categorize');

//   if (isActive) {
//     // Remove a marcação se já estiver ativa
//     return chain().unsetMark('categorize').run();
//   } else {
//     // Adiciona a marcação se não estiver ativa
//     return chain().setMark('categorize').run();
//   }
// },
// () =>
//   ({ state, chain }: { state: any; chain: any }) => {
//     // Verifica se o texto selecionado já tem a marcação
//     const isActive = state.selection.$from
//       .marks()
//       .some((mark: any) => mark.type.name === "categorize");

//     console.log(isActive);

//     if (isActive) {
//       // Remove a marcação se já estiver ativa
//       return chain().unsetMark("categorize").run();
//     } else {
//       // Adiciona a marcação se não estiver ativa
//       return chain().setMark("categorize").run();
//     }
//   },
