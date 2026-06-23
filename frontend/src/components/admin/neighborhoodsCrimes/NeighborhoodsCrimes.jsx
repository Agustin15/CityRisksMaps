const MAPS_API_KEY_BACKOFFICE = import.meta.env.VITE_MAPS_API_KEY_BACKOFFICE;
import styles from "./NeighborhoodsCrimes.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/adminContext/AuthContext";
import { APIProvider } from "@vis.gl/react-google-maps";
import { MenuSide } from "../menuSide/MenuSide";
import { ContainTable } from "./containTable/ContainTable";
import { AddWithList } from "./containTable/addWithList/AddWithList";
import { Modal } from "../modal/Modal";
import { Header } from "./header/Header";
import { createPortal } from "react-dom";
import { AddNeighborhoodCrimeProvider } from "../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext";
import { ContainMap } from "./containMap/ContainMap";
import { InteractionNeighborhoodsPolygonsProvider } from "../../../contexts/adminContext/InteractionNeighborhoodsPolygons";
import { EditWithList } from "./containTable/editWithList/EditWithList";
import { Helmet } from "react-helmet-async";
import { MenuResponsiveProvider } from "../../../contexts/MenuResponsiveContext";

export const NeighborhoodsCrimes = () => {
  const { loadingProfile, user, getProfile } = useAuth();
  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);

  useEffect(() => {
    document.querySelector("body").style.overflowY = "scroll";
    if (!user) {
      getProfile();
    }
  }, []);

  return (
    <>
      {user && !loadingProfile && (
        <MenuResponsiveProvider>
          <div className={styles.neighborhoodsCrimes}>
            <Helmet>
              <title>Administracion-Indice delitos en barrios</title>
              <meta name="robots" content="noindex"></meta>
            </Helmet>
            <MenuSide />

            <div className={styles.body}>
              <Header setAddForm={setAddForm} setEditForm={setEditForm} />
              {addForm &&
                createPortal(
                  <Modal>
                    <AddNeighborhoodCrimeProvider>
                      <AddWithList setAddForm={setAddForm} />
                    </AddNeighborhoodCrimeProvider>
                  </Modal>,
                  document.body
                )}

              {editForm &&
                createPortal(
                  <Modal>
                    <AddNeighborhoodCrimeProvider>
                      <EditWithList setEditForm={setEditForm} />
                    </AddNeighborhoodCrimeProvider>
                  </Modal>,
                  document.body
                )}

              <div className={styles.row}>
                <APIProvider apiKey={MAPS_API_KEY_BACKOFFICE}>
                  <InteractionNeighborhoodsPolygonsProvider>
                    <ContainMap />
                    <ContainTable />
                  </InteractionNeighborhoodsPolygonsProvider>
                </APIProvider>
              </div>
            </div>
          </div>
        </MenuResponsiveProvider>
      )}
    </>
  );
};
