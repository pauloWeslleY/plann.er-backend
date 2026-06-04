import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("pt-br");
dayjs.extend(localizedFormat);

export interface DateJS {
  dayjs: (date?: dayjs.ConfigType) => dayjs.Dayjs;
}

export const dateJS = (date?: dayjs.ConfigType): dayjs.Dayjs => dayjs(date);
