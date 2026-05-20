const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";
import { useAuth } from "../../../../../../contexts/adminContext/AuthContext";
import { useAddNeighborhoodCrime } from "../../../../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext";

export const LoadData = ({ setLoading, setErrorLoad, setNeighborhoods }) => {
  const { setUser } = useAuth();
  const { values, setValues } = useAddNeighborhoodCrime();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchGetNeighborhoods = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          LOCALHOST_BACKEND + "/admin/neighborhood/allNeighborhoods",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-type": "application/json"
            }
          }
        );

        const result = await response.json();

        if (!response.ok) {
          if (response.status == 401) {
            setUser();
            navigate("/admin/login");
          } else throw new Error(result.messageError);
        }

        setValues({
          ...values,
          neighborhoodsCrime: result.map((neighborhood) => {
            return {
              idNeighborhood: neighborhood.idNeighborhood,
              name: neighborhood.name,
              amount: null
            };
          })
        });

        setNeighborhoods(result);
      } catch (error) {
        setErrorLoad(error.message || "Error en la solicitud");
      } finally {
        setLoading(false);
      }
    };

    fetchGetNeighborhoods();
  }, []);
};
