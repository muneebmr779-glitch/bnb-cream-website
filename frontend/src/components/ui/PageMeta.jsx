import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../../utils/constants';

const PageMeta = ({ title, description }) => (
  <Helmet>
    <title>{title ? `${title} | ${APP_NAME}` : APP_NAME}</title>
    {description && <meta name="description" content={description} />}
  </Helmet>
);

export default PageMeta;
