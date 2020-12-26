declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  interface Process extends NodeJS.Process {
    browser?: boolean;
  }
}
