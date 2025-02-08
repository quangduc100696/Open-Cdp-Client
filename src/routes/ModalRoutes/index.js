import { HASH_MODAL, HASH_MODAL_CLOSE } from 'configs';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { InAppEvent } from 'utils/FuseUtils';
import DrawerCustom from 'components/DrawerCustom';
import ProductRoute from './ProductRoute.js';
import OrderRoute from './OrderRoute';
import LeadRoute from './LeadRouter.js';

const modalRoutes = [
  ...ProductRoute,
  ...OrderRoute,
  ...LeadRoute
]
const log = (key, val) => console.log('[routes.draw-routes] ' + key + ' ', val);
const notFoundHash = { Component: () => <div /> };

const getModalRoute = (urlHash) => {
  if(!urlHash) {
    return notFoundHash;
  }
  const iHash = urlHash.replaceAll('/', '.')
  const modalRoute = modalRoutes.find(route => iHash.includes(route.path));
  log('==== modalRoute', modalRoute)
  if (!modalRoute) {
    return notFoundHash;
  }
  if(modalRoute['Component']) {
    delete modalRoute.routes;
    return modalRoute;
  }
  const route = modalRoute.routes.find(route => iHash.includes(route.path));
  return route || notFoundHash;
};

function ModalRoutes() {

  const [ params, setParams ] = useState({ open: false });
  const handleEventDraw = useCallback( ({ hash, data, title }) => {
    log('#hash', {hash, data});
    setParams({open: true, hash, data, title});
  }, []);

  const handleCloseDraw = useCallback( () => {
    setParams({open: false});
  }, []);

  useEffect( () => {
    InAppEvent.addEventListener(HASH_MODAL, handleEventDraw);
    InAppEvent.addEventListener(HASH_MODAL_CLOSE, handleCloseDraw);
    return () => {
      InAppEvent.removeListener(HASH_MODAL, handleEventDraw);
      InAppEvent.removeListener(HASH_MODAL_CLOSE, handleCloseDraw);
    };
  }, [handleEventDraw, handleCloseDraw]);

  const closeModal =useCallback(() => {
    setParams({open: false})
  }, []);

  const ModalRoute = useMemo(
    () => getModalRoute(params.hash),
    [params.hash],
  );

  return (
    <DrawerCustom
      {...ModalRoute?.modalOptions}
      title={params?.title || ModalRoute?.modalOptions?.title}
      open={params.open }
      onClose={closeModal}
    >
      <ModalRoute.Component closeModal={closeModal} {...params} />
    </DrawerCustom>
  );
}

export default ModalRoutes;
