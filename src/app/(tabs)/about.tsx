/**
 * Маршрут `/about` — вкладка «О приложении».
 *
 * @module
 */

import { AboutScreen } from '../../features/about/AboutScreen';

/**
 * Показывает экран «О приложении».
 *
 * @returns Экран «О приложении».
 */
export default function AboutRoute() {
  return <AboutScreen />;
}
