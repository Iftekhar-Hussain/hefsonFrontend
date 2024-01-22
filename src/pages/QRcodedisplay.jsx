import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { listQrcode } from "../actions/qrcode";
import { useParams } from "react-router-dom";
import axios from "axios";

const QRcodesDisplay = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  useEffect(() => {
    dispatch(listQrcode(1, 10, id));
  }, []);

  const { qrcode, loading, Length } = useSelector(
    (state) => state.qrcodeReducer
  );

  return (
    <div className="Qrcodes">
      <div className="container">
        <HeaderComponent />
        <div className="row">
          <div className="col-12">
            <div className="UnitTop spaceBetween">
              <h4 className="text-capitalize">ABC Logistic</h4>
            </div>
          </div>
        </div>

        {qrcode?.length === 0 ? (
          <h4 className="mt-4" style={{ paddingLeft: "50px" }}>
            No QR codes to list. Please add some QR codes to show
          </h4>
        ) : (
          <div className="row mt-3 ms-4 ms-md-0">
            {qrcode?.map((data, index) => (
              <div
                className="col-lg-2 col-md-3 col-sm-4 col-6 text-center py-3"
                key={index}
              >
                <div className="Qrimage">
                  <img src={data?.qrData?.image} alt="" />
                  <div className="iconBox">
                    {/* <i className="fa-solid fa-pen" title="Edit"></i> */}
                    <i
                      title="download"
                      className="fa-solid fa-download"
                      onClick={async () => {
                        if (data?.qrData && data?.qrData?.base64) {
                          try {
                            const blob = await fetch(data?.qrData?.base64).then(
                              (res) => res.blob()
                            );

                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = "image.png";
                            link.click();
                            URL.revokeObjectURL(url);
                          } catch (error) {
                            console.log(error);
                          }
                        }
                      }}
                    ></i>
                  </div>
                </div>
                <p className="mb-0 fw-bold mt-2">{data?.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToolBox />
    </div>
  );
};

export default QRcodesDisplay;
