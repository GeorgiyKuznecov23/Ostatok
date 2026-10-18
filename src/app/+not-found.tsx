import { router } from 'expo-router';

import { MessageView } from '../features/products/ui/StatusView';

export default function NotFoundRoute() {
  return (
    <MessageView
      title="Страница не найдена"
      text="В приложении нет такого адреса. Проверьте ссылку или вернитесь в каталог."
      buttons={[{ label: 'В каталог', onPress: () => router.replace('/') }]}
    />
  );
}
