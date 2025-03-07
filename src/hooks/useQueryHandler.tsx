import { useAppDispatch } from '../store/hooks';
import { setLoading, showModal } from '../store/slices/commonSlice';

type operationType = 'Login' | 'Register' | 'General'| 'Update' | 'Delete'|'Company'|'User'|'Product'|'Order'|'Document'|'Ticket'|'Task';

const useQueryHandler = () => {
  const dispatch = useAppDispatch();

  const tryQuery = async <T,>(
    func: (...args: any[]) => Promise<T>,
    operationType: operationType,
  ): Promise<T | undefined> => {
    dispatch(setLoading(true));
    try {
      const result = await func();
      dispatch(setLoading(false));
      return result;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      if (error.message === 'Network Error') {
        dispatch(
          showModal({
            autohide: true,
            ModalContent: {
              title: 'Network Error',
              description: 'Please check your internet connection',
              type: 'Error',
            },
          }),
        );
      } else {
        dispatch(
          showModal({
            ModalContent: {
              title: `${operationType} Error`,
              description: errorMessage,
              type: 'Error',
            },
          }),
        );
      }

      dispatch(setLoading(false));
    }
  };

  return {tryQuery};
};
export default useQueryHandler;