import "@emotion/react";

type Colors = {
  300: string;
  400: string;
  500: string;
  600: string;
};

declare module "@emotion/react" {
  export interface Theme {
    blue: Colors;
    orange: Colors;
  }
}
