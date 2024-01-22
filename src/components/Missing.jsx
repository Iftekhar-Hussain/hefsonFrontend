import { Link } from "react-router-dom";

const Missing = () => {
  return (
    // <article style={{ padding: "100px" }}>
    //     <h1>Oops!</h1>
    //     <p>Page Not Found</p>
    //     <div className="flexGrow">
    //         <Link to="/">Visit Our Homepage</Link>
    //     </div>
    // </article>
    <section className="text-center vh-100 centerMid">
      <div className="information">
        <h2>Oops!</h2>

        <p>Page Not Found</p>
        <p className=" mt-4 mb-0">
          <Link className="d-flex" to="/home">
            <button className="btn">
              <img src="./assets/icons/leftArrow.svg" alt="" className="me-2" />{" "}
              Visit Our Homepage
            </button>
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Missing;
