import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale("pt-br");
dayjs.extend(localizedFormat);

export interface IDateService {
  date(date?: dayjs.ConfigType): dayjs.Dayjs;
}

export class DateService implements IDateService {
  date(date?: dayjs.ConfigType): dayjs.Dayjs {
    return dayjs(date);
  }
}
