/**
 * Экран для любого адреса, которого нет в приложении, например `/unknown`.
 *
 * @module
 */

import { router } from 'expo-router';

import { MessageView } from '../features/products/ui/StatusView';

/**
 * Сообщает, что страницы нет, и даёт кнопку «В каталог».
 * `router.replace` заменяет текущий экран каталогом, поэтому «Назад» не вернёт на неверный адрес.
 *
 * @returns Сообщение «Страница не найдена».
 */
export default function NotFoundRoute() {
  return (
    <MessageView
      title="Страница не найдена"
      text="В приложении нет такого адреса. Проверьте ссылку или вернитесь в каталог."
      buttons={[{ label: 'В каталог', onPress: () => router.replace('/') }]}
    />
  );
}
