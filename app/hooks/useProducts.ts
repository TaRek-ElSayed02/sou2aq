// hooks/useProducts.ts
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchAllProducts,
  fetchProductsByUserId,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  clearProducts,
  setCurrentProduct,
  clearCurrentProduct,
  clearError,
  clearFetchSuccess,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  clearAllSuccess,
  ProductFormData
} from '../../store/productStore';

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const productState = useSelector((state: RootState) => state.products);

  return {
    // State
    allProducts: productState.products,
    userProducts: productState.userProducts,
    currentProduct: productState.currentProduct,
    loading: productState.loading,
    error: productState.error,
    fetchSuccess: productState.fetchSuccess,
    createSuccess: productState.createSuccess,
    updateSuccess: productState.updateSuccess,
    deleteSuccess: productState.deleteSuccess,
    
    // Actions
    fetchAllProducts: () => dispatch(fetchAllProducts()),
    fetchProductsByUserId: (userId: string) => dispatch(fetchProductsByUserId(userId)),
    fetchProductById: (productId: string) => dispatch(fetchProductById(productId)),
    createProduct: (productData: ProductFormData, imageFile?: File) => 
      dispatch(createProduct({ productData, imageFile })),
    updateProduct: (productId: string, productData: Partial<ProductFormData>, imageFile?: File) =>
      dispatch(updateProduct({ productId, productData, imageFile })),
    deleteProduct: (productId: string) => dispatch(deleteProduct(productId)),
    setCurrentProduct: (product: any) => dispatch(setCurrentProduct(product)),
    
    // Clear actions
    clearProducts: () => dispatch(clearProducts()),
    clearCurrentProduct: () => dispatch(clearCurrentProduct()),
    clearError: () => dispatch(clearError()),
    clearAllSuccess: () => dispatch(clearAllSuccess()),
    clearFetchSuccess: () => dispatch(clearFetchSuccess()),
    clearCreateSuccess: () => dispatch(clearCreateSuccess()),
    clearUpdateSuccess: () => dispatch(clearUpdateSuccess()),
    clearDeleteSuccess: () => dispatch(clearDeleteSuccess()),
  };
};