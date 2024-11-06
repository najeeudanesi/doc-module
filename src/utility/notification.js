import { toast } from 'react-hot-toast';


const notification = ({
  title,
  message,
  type,
  onRemoval = () => { },
  duration = 50000
}) => {
  try {
    toast(message, {
      autoClose: 50000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      type
    });
  } catch (e) {
    console.log(e);
  }
};

export default notification;
