import "../index.css";
import { Link } from "react-router-dom";
import { getAllShops } from "../api/strapi/shopApi";
import { useState, useEffect } from "react";
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
// import Login from "./Login.jsx";
// import { ChooseShop } from "./ChooseShop.jsx";
// import { ShopDetails } from "./ShopDetails.jsx";
// const baseURL = "https://cookbstaging.careervio.com/api/shops/?populate=image";

function Home() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { id } = useParams();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  // const token = import.meta.env.VITE_TOKEN_TEST ;

  console.log("token in home: ", token);
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const shopData = await getAllShops(token);
        setShops(shopData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchShops();
  }, [token]);

  localStorage.setItem('shops', JSON.stringify(shops));

  if (loading) return <LoadingSpinner />
  if (error) return <p>Error: {error}</p>;
  return (
    <>
      <Header />
      {/* <p className="text-3xl text-center pt-10">{shops[1].image.image.data.attributes.url}</p> */}
      {/* <p className="text-3xl text-center pt-10">{shops[1].image}</p> */}
      {/* <p>Welcome, {displayName}!</p> */}
      {/* <App /> */}
      {/* <Login/> */}
      {/* <script>
        if (shops[0].image?.data?.attributes?.url) {
          console.log("shop.image.data.attributes.url: ", shops[0].image.data.attributes.url)
        }
      </script> */}
      <div className="mx-auto px-4">
        <div className="grid mt-5 md:grid-cols-2 md:gap-5 md:mt-2 lg:grid-cols-3  lg:gap-5 lg:mt-7">
        {shops.map((shop) => (
          <Link to={`/shop/${shop.id}`} key={shop.id}>

            <div className="shop-2">
            <span
              className="circle"
              style={{
                backgroundImage: shop.image?.data?.attributes?.url
                  ? `url(${API_URL}${shop.image.data.attributes.url})`
                  : 'url(https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg)', // fallback to default image if no image found
                backgroundSize: "cover",
              }}
            ></span>
              <span className="pl-2">{shop.name}</span>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </>
  );
}

export default Home;

// function Home() {
//   const [shops, setShops] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_URL = import.meta.env.VITE_API_URL;
//   const token = localStorage.getItem('token');

//   console.log("token in home: ", token);

//   useEffect(() => {
//     const fetchShops = async () => {
//       try {
//         setLoading(true);
//         const shopData = await getAllShops(token);

//         // Sort the shops by name (A-Z) after fetching the data
//         const sortedShops = shopData.sort((a, b) =>
//           a.name.localeCompare(b.name, 'th', { sensitivity: 'base' }) // This works for both English and Thai
//         );

//         setShops(sortedShops);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching shops:', error);
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchShops();
//   }, [token]);

//   if (loading) return <LoadingSpinner />;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <>
//       <Header />
//       <div className="mx-auto px-4">
//         <div className="grid mt-5 md:grid-cols-2 md:gap-5 md:mt-2 lg:grid-cols-3 lg:gap-5 lg:mt-7">
//           {shops.map((shop) => (
//             <Link to={`/shop/${shop.id}`} key={shop.id}>
//               <div className="shop-2">
//                 <span
//                   className="circle"
//                   style={{
//                     backgroundImage: shop.image?.data?.attributes?.url
//                       ? `url(${API_URL}${shop.image.data.attributes.url})`
//                       : 'url(https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg)', // fallback image
//                     backgroundSize: 'cover',
//                   }}
//                 ></span>
//                 <span className="pl-2">{shop.name}</span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// export default Home;
