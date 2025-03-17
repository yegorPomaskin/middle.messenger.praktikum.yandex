declare module "*.css" {
  const css: { [key: string]: string };
  export default css;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

// declare module "*.hbs" {
//   const content: any;
//   export default content;
// }

declare module "*.hbs?raw" {
  const content: string;
  export default content;
}
