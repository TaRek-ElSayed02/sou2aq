"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/userStore";

function SyncAuthWithUser() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  
  useEffect(() => {
    // عند استرجاع البيانات من localStorage، تأكد من تحديث userStore
    if (authUser) {
      console.log('SyncAuthWithUser - authUser:', authUser);
      console.log('SyncAuthWithUser - dispatching setUser');
      dispatch(setUser(authUser));
    }
  }, [authUser, dispatch]);
  
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SyncAuthWithUser />
        {children}
      </PersistGate>
    </Provider>
  );
}
