import { DrawerWrapper } from './styles';

const DrawerMaxWidth = (title) => {
  switch (title) {
    case 'Tạo cơ hội':
      return 1250;
    default:
      return 750;
  }
}

const DrawerRoute = ({ width = 600, children, onClose, title, ...props }) => {
  return (
    <DrawerWrapper
      width={DrawerMaxWidth(title)}
      onClose={onClose}
      styles={
        { wrapper: { maxWidth: '100vw' } }
      }
      {...props}
      destroyOnClose
      closable={false}
      footer={null}
    >
      {children}
    </DrawerWrapper>
  )
};

export default DrawerRoute;
