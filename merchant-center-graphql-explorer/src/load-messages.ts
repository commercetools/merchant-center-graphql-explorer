import {
  parseChunkImport,
  type TMessageTranslations,
  TI18NImportData,
} from '@commercetools-frontend/i18n';

const getChunkImport = (locale: string): Promise<TI18NImportData> => {
  switch (locale) {
    case 'es':
      return import(
        './i18n/compiled-data/es.json' /* webpackChunkName: "app-i18n-es" */
      );
    case 'de':
      return import(
        './i18n/compiled-data/de.json' /* webpackChunkName: "app-i18n-de" */
      );
    default:
      return import(
        /* webpackChunkName: "app-i18n-en" */
        './i18n/compiled-data/en.json'
      );
  }
};
const loadMessages = async (locale: string): Promise<TMessageTranslations> => {
  try {
    const chunkImport = await getChunkImport(locale);
    return parseChunkImport(chunkImport);
  } catch (error) {
    console.warn(
      `Something went wrong while loading the app messages for ${locale}`,
      error
    );
    return {};
  }
};

export default loadMessages;
