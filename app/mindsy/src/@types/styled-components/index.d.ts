// src/@types/styled-components/index.d.ts

import 'styled-components';
import 'styled-components/native';
import { ThemeType } from '../theme';  // ajuste o path se necessário

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeType {}
}
