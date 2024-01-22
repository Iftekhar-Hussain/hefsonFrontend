import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <section className="text-center vh-100 centerMid">
      <div className="information">
        <h2>Unauthorized</h2>
        <p>You do not have access to the requested page.</p>
        <button className="btn">
          <Link to="/">Please Login</Link>
        </button>
      </div>
    </section>
  );
};

export default Unauthorized;
