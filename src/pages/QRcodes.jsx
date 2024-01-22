import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listSoiltableCategory } from "../actions/soiltableCategory";
import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
const QRcodes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listSoiltableCategory(1, 10));
  }, []);

  const soiltableCategoryData = useSelector(
    (state) => state.soiltableCategoryReducer
  );
  const { soiltableRequestCategory, loading, Length } = soiltableCategoryData;

  const navigate = useNavigate();
  return (
    <div className="Qrcodes">
      <div className="container-fluid">
        <HeaderComponent />
        <div className="row mx-sm-4 mx-0 mt-30 ">
          <div className="col-12">
            <div className="UnitTop spaceBetween">
              <h4 className="text-capitalize">ABC Logistic</h4>
            </div>
          </div>
        </div>
        {soiltableRequestCategory?.length === 0 ? (
          <h4 className="mt-4" style={{ paddingLeft: "50px" }}>
            No QR codes to list. Please add some QR codes to show
          </h4>
        ) : (
          <div className="row mx-sm-4 mx-0 mt-30 mb-5">
            {soiltableRequestCategory?.map((data, index) => (
              <div
                className="col-lg-2 col-md-3 col-sm-4 col-6 text-center"
                key={index}
              >
                <div
                  className="Qrimage"
                  onClick={() => navigate(`/QRcodesDisplay/${data?._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={data?.image} alt={data?.name} />
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

export default QRcodes;
