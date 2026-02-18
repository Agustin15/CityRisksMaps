import styles from "./DrawMode.module.css";
import { TerraDraw, TerraDrawPolygonMode } from "terra-draw";
import { TerraDrawGoogleMapsAdapter } from "terra-draw-google-maps-adapter";
import { useMap } from "@vis.gl/react-google-maps";

export const DrawMode = ({ drawMode, setDrawMode }) => {
  const map = useMap();

  const handleClick = () => {
    const draw = new TerraDraw({
      adapter: new TerraDrawGoogleMapsAdapter({
        map,
        lib: google.maps,
        coordinatePrecision: 9
      }),
      modes: [
        new TerraDrawPolygonMode({
          editable: true,
          styles: (() => {
            return {
              fillColor: "blue",
              outlineColor: "blue"
            };
          })()
        })
      ]
    });
    draw.start();

    draw.on("ready", () => {
      draw.setMode("polygon");
    });

    setDrawMode(draw);
  };

  return (
    <div className={styles.drawMode}>
      <button onClick={handleClick}>Dibujar</button>
      <button onClick={() => console.log(drawMode.getSnapshot())}>
        GEOJSON
      </button>
      <button
        onClick={() => {
          if (!drawMode) return;
          drawMode.clear();
        }}
      >
        Borrar
      </button>
    </div>
  );
};
