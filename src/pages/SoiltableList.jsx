import { useEffect, useRef, useState } from "react";
import HeaderComponent from "../components/Header/HeaderComponent";
import ToolBox from "./ToolBox";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  requestSoiltableCategory,
  listSoiltableCategory,
} from "../actions/soiltableCategory";
import { ClipLoader, PropagateLoader } from "react-spinners";
import InfiniteScroll from "react-infinite-scroll-component";
import Cookies from "js-cookie";
import ToolBoxAdmin from "./ToolBoxAdmin";
import profileImg from "../assets/mango.png";
import axios from "axios";
import Select from "react-select";
import * as api from "../api/index";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import CalenderIcon from "../assets/icons/CalendarDate.svg";
import "rc-time-picker/assets/index.css";
import moment from "moment";
import TimePicker from "rc-time-picker";
const showSecond = false;
const str = showSecond ? "HH:mm:ss" : "HH:mm";

const baseURL = process.env.REACT_APP_BASEURL;

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const header = {
  headers: {
    Authorization: loginToken,
  },
};

const Steps = ({ currentStep }) => {
  return (
    <div className="col-12 ">
      <div className="tabNavigation mb-4">
        <div
          className={`stepBox ${currentStep === 2 ? "activeStep" : ""}
${currentStep - 1 >= 2 ? "successStep" : ""}`}
        >
          <div className="step ">
            <p className="mb-0">1</p>
          </div>
        </div>
        <div
          className={`stepBox ${currentStep === 3 ? "activeStep" : ""}
${currentStep - 1 >= 3 ? "successStep" : ""}`}
        >
          <div className="step ">
            <p className="mb-0">2</p>
          </div>
        </div>
        <div
          className={`stepBox ${currentStep === 4 ? "activeStep" : ""}
${currentStep - 1 >= 4 ? "successStep" : ""}`}
        >
          <div className="step">
            <p className="mb-0">3</p>
          </div>
        </div>
        <div
          className={`stepBox ${currentStep === 5 ? "activeStep" : ""}
${currentStep - 1 >= 5 ? "successStep" : ""}`}
        >
          <div className="step">
            <p className="mb-0">4</p>
          </div>
        </div>
        <div
          className={`stepBox ${currentStep === 6 ? "activeStep" : ""}
${currentStep - 1 >= 6 ? "successStep" : ""}`}
        >
          <div className="step">
            <p className="mb-0">5</p>
          </div>
        </div>
        <div className="middleLine"></div>
      </div>
    </div>
  );
};

let Index = 0;

const SoiltableList = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const dispatch = useDispatch();
  const ref = useRef();
  const ref2 = useRef();
  const ref7 = useRef();
  const ref8 = useRef();

  const [selectedTime, setSelectedTime] = useState(""); // State to store the selected time

  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);

  const [categoryData, setCategoryData] = useState({
    name: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  const handleNameBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: null,
      }));
    }
  };

  const handleImageBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Image is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: null,
      }));
    }
  };
  // image upload
  const [uploading, setUploading] = useState(false);

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("uploadImage", file);
    bodyFormData.append("folderName", "unit");
    setUploading(true);
    await axios
      .post(`${baseURL}/file/upload-image`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: loginToken,
        },
      })
      .then(async (response) => {
        console.log("response.data => ", response.data.data);
        setCategoryData({
          ...categoryData,
          image: response.data.data,
        });
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: null,
        }));
        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
    console.log("categoryData image => ", categoryData);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // const hasError = Object.values(errors).some((error) => error);
    // if (!hasError) {
    //   // Submit the form
    //   dispatch(requestSoiltableCategory(categoryData));
    //   clear();
    // }

    if (categoryData?.image === "" && categoryData?.name === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Image is required.",
      }));
    } else if (categoryData?.image === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Image is required.",
      }));
    } else if (categoryData?.name === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: null,
      }));
      dispatch(requestSoiltableCategory(categoryData));
      clear();
      closePopup();
    }
  };

  const clear = () => {
    setCategoryData({
      name: "",
      image: "",
    });
  };

  useEffect(() => {
    dispatch(listSoiltableCategory(1, 10));
    setCategoryList();
  }, []);

  const soiltableCategoryData = useSelector(
    (state) => state.soiltableCategoryReducer
  );
  const { soiltableRequestCategory, loading, Length } = soiltableCategoryData;

  const fetchDataOnScroll = async () => {
    try {
      if (Number(Length) <= Number(10 * (pageNumber - 1))) {
        setHasMore(false); //true
      } else {
        setHasMore(true); //false
        dispatch(listSoiltableCategory(pageNumber, 10));
        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      toast("Error fetching Posts");
    }
  };
  const override = {
    display: "flex",
    justifyContent: "center",
    marginTop: "100px ",
    borderColor: "red",
  };

  const [productCategory, setproductCategory] = useState(null);
  const [productData, setProductData] = useState({
    name: Cookies.get("st_name") ? JSON.parse(Cookies.get("st_name")) : "",
    categoryId: "",
    theme: Cookies.get("st_theme") ? JSON.parse(Cookies.get("st_theme")) : "",
    origin: Cookies.get("st_origin")
      ? JSON.parse(Cookies.get("st_origin"))
      : "",
    isOrganic: Cookies.get("st_isOrganic")
      ? JSON.parse(Cookies.get("st_isOrganic"))
      : "",
    organicDescription: "",
    transportationDays: Cookies.get("st_transportationDays")
      ? JSON.parse(Cookies.get("st_transportationDays"))
      : "",
    temperature: Cookies.get("st_temperature")
      ? JSON.parse(Cookies.get("st_temperature"))
      : "",
    calories: Cookies.get("st_calories")
      ? JSON.parse(Cookies.get("st_calories"))
      : "",
    water: Cookies.get("st_water") ? JSON.parse(Cookies.get("st_water")) : "",
    protien: Cookies.get("st_protien")
      ? JSON.parse(Cookies.get("st_protien"))
      : "",
    carbs: Cookies.get("st_carbs") ? JSON.parse(Cookies.get("st_carbs")) : "",
    sugar: Cookies.get("st_sugar") ? JSON.parse(Cookies.get("st_sugar")) : "",
    fiber: Cookies.get("st_fiber") ? JSON.parse(Cookies.get("st_fiber")) : "",
    fat: Cookies.get("st_fat") ? JSON.parse(Cookies.get("st_fat")) : "",
    storageInst: Cookies.get("st_storageInst")
      ? JSON.parse(Cookies.get("st_storageInst"))
      : "",
    customMessage: Cookies.get("st_customMessage")
      ? JSON.parse(Cookies.get("st_customMessage"))
      : "",
    image: Cookies.get("st_image") ? JSON.parse(Cookies.get("st_image")) : "",
    productImages: Cookies.get("st_productImages")
      ? JSON.parse(Cookies.get("st_productImages"))
      : [],
    productDetail: Cookies.get("st_productDetail")
      ? JSON.parse(Cookies.get("st_productDetail"))
      : "",
    timeline: Cookies.get("st_timeline")
      ? JSON.parse(Cookies.get("st_timeline"))
      : [
          {
            processingTime: "",
            processingDate: "",
            status: "",
            location: "",
          },
        ],
  });

  const handleTimeChangeReceiver = (time, index) => {
    if (time && time.isValid()) {
      // Check if the time is valid
      const formattedTime = time.format("HH:mm"); // Convert the moment object to "HH:mm" format

      setSelectedTime(formattedTime); // Update the selected time in state
      setProductData((prevState) => {
        const updatedTime = [...prevState.timeline];
        updatedTime[index].processingTime = formattedTime;
        return {
          ...prevState,
          timeline: updatedTime,
        };
      });
    } else {
      // Handle invalid time (e.g., clear the value)
      setSelectedTime(""); // Update the selected time in state
      setProductData((prevState) => {
        const updatedTime = [...prevState.timeline];
        updatedTime[index].processingTime = "";
        return {
          ...prevState,
          timeline: updatedTime,
        };
      });
    }
  };

  const handleDateChangeProcessingDate = (date, index) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = format(date, "yyyy-MM-dd");

      setProductData((prevState) => {
        const updatedDate = [...prevState.timeline];
        updatedDate[index].processingDate = formattedDate;
        return {
          ...prevState,
          timeline: updatedDate,
        };
      });
      // setErrors((prevErrors) => ({
      //   ...prevErrors,
      //   timeline: (prevErrors.timeline || []).map((err, i) =>
      //     i === index ? { ...err, processingDate: null } : err
      //   ),
      // }));
    }
  };

  const openDatePickerProcessingDate = () => {
    if (ref8.current) {
      ref8.current.setOpen(true);
    }
  };

  const handleAddTimeline = () => {
    setProductData((prevState) => ({
      ...prevState,
      timeline: [
        ...prevState.timeline,
        {
          processingTime: "",
          processingDate: "",
          status: "",
          location: "",
        },
      ],
    }));
  };

  // const [timelineFields, setTimelineFields] = useState([
  //   {
  //     processingTime: "",
  //     processingDate: "",
  //     status: "Pickup",
  //     location: "",
  //   },
  //   {
  //     processingTime: "",
  //     processingDate: "",
  //     status: "Arrival",
  //     location: "",
  //   },
  // ]);

  // const addMoreTimelineField = () => {
  //   const newField = {
  //     processingTime: "",
  //     processingDate: "",
  //     status: "",
  //     location: "",
  //   };
  //   setTimelineFields([...timelineFields, newField]);
  // };

  // const handleTimelineChange = (index, field, value) => {
  //   const updatedFields = [...timelineFields];
  //   updatedFields[index][field] = value;
  //   setTimelineFields(updatedFields);
  // };

  // const handleNext = () => {
  //   const updatedTimeline = timelineFields.map((field) => ({
  //     processingTime: field.processingTime,
  //     processingDate: field.processingDate,
  //     status: field.status,
  //     location: field.location,
  //   }));

  //   setProductData({
  //     ...productData,
  //     timeline: updatedTimeline,
  //   });

  //   // Move to the next step
  //   forthStepNext();
  // };

  console.log("productData -- ", productData);
  console.log("errors -- ", errors);
  // const [uploading, setUploading] = useState(false);

  const uploadProductImageHandler = async (e) => {
    console.log("driver image upload");
    console.log(e.target);

    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("uploadImage", file);
    bodyFormData.append("folderName", "unit");
    setUploading(true);
    await axios
      .post(`${baseURL}/file/upload-image`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: loginToken,
        },
      })
      .then(async (response) => {
        console.log("response.data => ", response.data.data);
        setProductData({
          ...productData,
          image: response.data.data,
        });

        setUploading(false);
      })
      .catch((err) => {
        console.log(err);
        setUploading(false);
      });
  };

  //isOrganic dropdown

  const isOrganicOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];
  const [selectedIsOrganic, setSelectedIsOrganic] = useState(null);
  const handleIsOrganic = (selectedOption) => {
    console.log(selectedOption, "--- selectedOption");
    setSelectedIsOrganic(selectedOption);

    setProductData({
      ...productData,
      isOrganic: selectedIsOrganic?.value,
    });
    if (errors !== undefined)
      setErrors((prevErrors) => ({
        ...prevErrors,
        isOrganic: null,
      }));
  };

  //theme dropdown

  const colorThemeOptions = [
    { value: "White", label: "White" },
    { value: "Black", label: "Black" },
  ];
  const [selectedColorTheme, setSelectedColorTheme] = useState(null);
  const handleColorThemeChange = (selectedOption) => {
    setSelectedColorTheme(selectedOption);

    setProductData({
      ...productData,
      theme: selectedOption?.value,
    });
    if (errors !== undefined)
      setErrors((prevErrors) => ({
        ...prevErrors,
        theme: null,
      }));
  };

  // setting Category for dropdown
  const [selectedCategoryOption, setSelectedCategoryOption] = useState(null);

  const handleChangeTrailerOptions = (selectedCategoryOption) => {
    setSelectedCategoryOption(selectedCategoryOption);
    // Access the selected value using selectedCategoryOption.value._id
    const selectedValue = selectedCategoryOption
      ? selectedCategoryOption?.value?._id
      : "";
    // ... define state variable to set value for this page
    setProductData({
      ...productData,
      categoryId: selectedValue,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      categoryId: null,
    }));
  };
  let valueCategory = null;
  if (productData.categoryId === "") {
    valueCategory = { value: "", label: "Select Category" }; // Set custom placeholder option
  } else if (
    productData.categoryId !== "" &&
    productCategory &&
    productCategory.length !== 0
  ) {
    let selectedCategory = productCategory.find(
      (em) => em._id === productData.categoryId
    );
    valueCategory = {
      value: selectedCategory,
      label: selectedCategory.unitNumber,
    }; // Set custom placeholder option
  } else {
    valueCategory = productCategory.find(
      (option) => option.value === productData.categoryId
    );
  }
  // dropdown Category

  async function setCategoryList() {
    const category = await axios.get(
      `${baseURL}/category/list?page=1&limit=1000`,
      header
    );
    if (category?.data?.data?.data.length > 0) {
      await setproductCategory(category?.data?.data?.data);
    }
  }

  const firstStepNext = (e) => {
    e.preventDefault();

    if (
      // productData.image === "" &&
      productData.name === "" &&
      productData.theme === "" &&
      productData.categoryId === "" &&
      productData.origin === ""
    ) {
      // setErrors((prevErrors) => ({
      //   ...prevErrors,
      //   image: "Image is required.",
      // }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        theme: "Theme is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryId: "Category is required.",
      }));
      // setErrors((prevErrors) => ({
      //   ...prevErrors,
      //   origin: "Origin is required.",
      // }));
    } else if (productData.name === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required.",
      }));
    } else if (productData.theme === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        theme: "Theme is required.",
      }));
    } else if (productData.categoryId === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryId: "Category is required.",
      }));
    } else if (productData.origin === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        origin: "Origin is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        image: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        theme: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryId: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        origin: null,
      }));
    }
    if (
      // productData.image !== "" &&
      productData.name !== "" &&
      productData.theme !== "" &&
      productData.categoryId !== "" &&
      productData.origin !== ""
    ) {
      Cookies.set("st_name", JSON.stringify(productData?.name));
      Cookies.set("st_theme", JSON.stringify(productData?.theme));
      Cookies.set("st_origin", JSON.stringify(productData?.origin));
      Cookies.set("st_image", JSON.stringify(productData?.image));

      setCurrentStep(currentStep + 1);
    }
  };

  const handleTimelineStatusBlur = (index) => {
    if (productData?.timeline[index]?.status.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        status: "Status is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        status: null,
      }));
    }
  };
  const handleTimelineLocationBlur = (index) => {
    if (productData?.timeline[index]?.location.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: "Location is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: null,
      }));
    }
  };

  // validation

  const handleThemeBlur = (e) => {
    const value = productData.theme;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        theme: "Theme is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        theme: null,
      }));
    }
  };

  const handleCategoryBlur = (e) => {
    const value = productData.categoryId;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryId: "Category is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryId: null,
      }));
    }
  };

  const handleOriginBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        origin: "Origin is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        origin: null,
      }));
    }
  };

  const secondStepNext = (e) => {
    e.preventDefault();

    if (
      productData.isOrganic === "" &&
      productData.organicDescription === "" &&
      productData.transportationDays === "" &&
      productData.temperature === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        organicDescription: "Description is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        transportationDays: "Transportation days is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        temperature: "Temperature is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        isOrganic: "Organic is required.",
      }));
    } else if (productData.isOrganic === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        isOrganic: "Organic is required.",
      }));
      // } else if (productData.organicDescription === "") {
      //   setErrors((prevErrors) => ({
      //     ...prevErrors,
      //     organicDescription: "Description is required.",
      //   }));
    } else if (productData.transportationDays === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        transportationDays: "Transportation days is required.",
      }));
    } else if (productData.temperature === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperature: "Temperature is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        isOrganic: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        organicDescription: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        transportationDays: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        temperature: null,
      }));
    }
    if (
      productData.isOrganic !== "" &&
      // productData.organicDescription !== "" &&
      productData.transportationDays !== "" &&
      productData.temperature !== ""
    ) {
      Cookies.set("st_isOrganic", JSON.stringify(productData?.isOrganic));
      Cookies.set(
        "st_transportationDays",
        JSON.stringify(productData?.transportationDays)
      );
      Cookies.set("st_temperature", JSON.stringify(productData?.temperature));
      setCurrentStep(currentStep + 1);
    }
  };

  const handleIsOrganicBlur = (e) => {
    const value = e.target.value.trim();

    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        isOrganic: "Organic is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        isOrganic: null,
      }));
    }
    // const value = productData.isOrganic;
    // if (value === true || value === false) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     isOrganic: null,
    //   }));
    // } else {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     isOrganic: "Organic is required.",
    //   }));
    // }
  };

  const handleOrganicDescriptionBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        organicDescription: "Description is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        organicDescription: null,
      }));
    }
  };

  const handleTransportationDaysBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        transportationDays: "Transportation days is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        transportationDays: null,
      }));
    }
  };

  const handleTemperatureBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperature: "Temperature is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        temperature: null,
      }));
    }
  };

  const thirdStepNext = (e) => {
    e.preventDefault();

    if (
      productData.calories === "" &&
      productData.water === "" &&
      productData.protien === "" &&
      productData.carbs === "" &&
      productData.sugar === "" &&
      productData.fiber === "" &&
      productData.fat === "" &&
      productData.storageInst === "" &&
      productData.customMessage === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        calories: "Calories is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        water: "Water is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        protien: "Protien is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        carbs: "Carbs is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        sugar: "Sugar is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        fiber: "Fiber is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        fat: "Fat is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        storageInst: "Storage Instruction is required.",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        customMessage: "Custom message is required.",
      }));
    } else if (productData.calories === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        calories: "Calories is required.",
      }));
    } else if (productData.water === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        water: "Water is required.",
      }));
    } else if (productData.protien === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        protien: "Protien is required.",
      }));
    } else if (productData.carbs === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carbs: "Carbs is required.",
      }));
    } else if (productData.sugar === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sugar: "Sugar is required.",
      }));
    } else if (productData.fiber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fiber: "Fiber is required.",
      }));
    } else if (productData.fat === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fat: "Fat is required.",
      }));
    } else if (productData.storageInst === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        storageInst: "Storage Instruction is required.",
      }));
    } else if (productData.customMessage === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        customMessage: "Custom message is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        calories: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        water: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        protien: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        carbs: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        sugar: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        fiber: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        fat: null,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        storageInst: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        customMessage: null,
      }));
    }
    if (
      productData.calories !== "" &&
      productData.water !== "" &&
      productData.protien !== "" &&
      productData.carbs !== "" &&
      productData.sugar !== "" &&
      productData.fiber !== "" &&
      productData.fat !== "" &&
      productData.storageInst !== "" &&
      productData.customMessage !== ""
    ) {
      Cookies.set("st_calories", JSON.stringify(productData?.calories));
      Cookies.set("st_water", JSON.stringify(productData?.water));
      Cookies.set("st_protien", JSON.stringify(productData?.protien));
      Cookies.set("st_carbs", JSON.stringify(productData?.carbs));
      Cookies.set("st_sugar", JSON.stringify(productData?.sugar));
      Cookies.set("st_fiber", JSON.stringify(productData?.fiber));
      Cookies.set("st_fat", JSON.stringify(productData?.fat));
      Cookies.set("st_storageInst", JSON.stringify(productData?.storageInst));
      Cookies.set(
        "st_customMessage",
        JSON.stringify(productData?.customMessage)
      );

      setCurrentStep(currentStep + 1);
    }
  };

  const handleCaloriesBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        calories: "Calories is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        calories: null,
      }));
    }
  };

  const handleWaterBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        water: "Water is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        water: null,
      }));
    }
  };

  const handleProtienBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        protien: "Protien is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        protien: null,
      }));
    }
  };

  const handleCarbsBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carbs: "Carbs is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        carbs: null,
      }));
    }
  };

  const handleSugarBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sugar: "Sugar is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sugar: null,
      }));
    }
  };

  const handleFiberBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fiber: "Fiber is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fiber: null,
      }));
    }
  };

  const handleFatBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fat: "Fat is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fat: null,
      }));
    }
  };

  const handleStorageInstBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        storageInst: "Storage Instruction is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        storageInst: null,
      }));
    }
  };

  const handleCustomMessageBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        customMessage: "Custom message is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        customMessage: null,
      }));
    }
  };

  const [responseData, setResponseData] = useState({});
  const [slug, setSlug] = useState("");

  const skipTimelineStep = async (e) => {
    e.preventDefault();
    if (productData.productDetail !== "") {
      try {
        const { timeline, ...rest } = productData;
        const { data } = await api.createSoiltableProduct(rest);

        setResponseData(data.data[0].qrData);
        setSlug(data.data[0].slug);
        setErrors({});
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.log(error.message);
        console.log(error);

        if (loginToken === null) {
          window.location.replace("/login");
        }
        if (
          error.response &&
          error.response.data.message ===
            "You are not an authorized user for this action."
        ) {
          window.location.replace("/login");
        }
        if (error.response && error.response.status === 400) {
          return toast(error.response.data.message + ", please reload");
        }
        if (error.response) {
          if (error.response && error.response.status === 400) {
            return toast(error.response.data.message);
          }
        }
      }
    }
  };

  const timelineStep = async (e) => {
    e.preventDefault();
    Cookies.set("st_timeline", JSON.stringify(productData?.timeline));

    let timelineValidation = Cookies.get("st_timeline")
      ? JSON.parse(Cookies.get("st_timeline"))
      : [
          {
            processingTime: "",
            processingDate: "",
            status: "",
            location: "",
          },
        ];
    console.log("timelineValidation --  ", timelineValidation);

    const findEmptyFieldWithId = (timelineArray) => {
      for (const [index, timeline] of timelineArray.entries()) {
        for (const [field, value] of Object.entries(timeline)) {
          if (value === "" || value === null) {
            return { field, id: index }; // Return the field and its associated "id"
          }
        }
      }
      return null; // Return null if no empty field is found
    };

    const emptyFieldInfo = findEmptyFieldWithId(timelineValidation);
    console.log("emptyFieldInfo -- ", emptyFieldInfo);

    if (emptyFieldInfo) {
      const { field, id } = emptyFieldInfo;

      Index = id;
      console.log(`The field "${field}" with id "${id}" has an empty value.`);

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `${field} is required.`,
      }));
      console.log(errors, "ty");
    } else if (productData.productDetail !== "") {
      try {
        const { data } = await api.createSoiltableProduct(productData);

        setResponseData(data.data[0].qrData);
        setSlug(data.data[0].slug);
        setErrors({});
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.log(error.message);
        console.log(error);

        if (loginToken === null) {
          window.location.replace("/login");
        }
        if (
          error.response &&
          error.response.data.message ===
            "You are not an authorized user for this action."
        ) {
          window.location.replace("/login");
        }
        if (error.response && error.response.status === 400) {
          return toast(error.response.data.message + ", please reload");
        }
        if (error.response) {
          if (error.response && error.response.status === 400) {
            return toast(error.response.data.message);
          }
        }
      }
    }
  };

  const forthStepNext = async (e) => {
    e.preventDefault();
    Cookies.set("st_productImages", JSON.stringify(productData?.productImages));
    Cookies.set("st_productDetail", JSON.stringify(productData?.productDetail));
    if (productData.productDetail === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productDetail: "Product detail is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productDetail: null,
      }));

      setCurrentStep(currentStep + 1);
    }
  };

  const handleProductDetailBlur = (e) => {
    const value = e.target.value;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productDetail: "Product detail is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productDetail: null,
      }));
    }
  };

  const uploadMultipleImageHandler = async (e) => {
    const files = Array.from(e.target.files);

    // Perform validation checks
    if (files.length === 0) {
      console.log("No files selected.");
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    // Perform individual file validation checks
    for (const file of files) {
      // Check file size (example: maximum allowed file size is 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        invalidFiles.push(file.name);
        continue;
      }

      // Check file type (example: only accept image files)
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(file.name);
        continue;
      }

      validFiles.push(file);
    }

    // Display any invalid files
    if (invalidFiles.length > 0) {
      console.log("Invalid files:", invalidFiles);
      // You can display an error message or take appropriate action here
    }

    // Proceed with file upload for valid files
    for (const file of validFiles) {
      const bodyFormData = new FormData();
      bodyFormData.append("uploadImage", file);
      bodyFormData.append("folderName", "unit");
      setUploading(true);

      try {
        const response = await axios.post(
          `${baseURL}/file/upload-image`,
          bodyFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: loginToken,
            },
          }
        );

        console.log("response.data => ", response.data.data);
        setProductData((prevData) => ({
          ...prevData,
          productImages: [...prevData.productImages, response.data.data],
        }));
      } catch (error) {
        console.log(error);
      }

      setUploading(false);
    }

    console.log("productData.productImages => ", productData.productImages);
  };

  const removeImage = (index) => {
    setProductData((prevData) => {
      const updatedImages = [...prevData.productImages];
      updatedImages.splice(index, 1);
      return {
        ...prevData,
        productImages: updatedImages,
      };
    });
  };

  const popupRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setErrors({});
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };
  const closePopupBlur = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const renderFormFields = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            {/* Add new product  */}
            <div className="row">
              <div className="col-12">
                <div className="">
                  <label htmlFor="uploadFile" className="uploadButton">
                    {productData?.image ? (
                      <div className="col">
                        <img
                          src={productData?.image ? productData?.image : ""}
                          class=" rounded-circle"
                          style={{
                            width: "50px",
                            height: "50px",
                            cursor: "pointer",
                          }}
                          alt={productData?.name ? productData?.name : ""}
                        />
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Upload Image"
                          id="uploadFile"
                          onChange={(e) => uploadProductImageHandler(e)}
                          hidden
                          // onBlur={(e) => handleImageBlur(e)}
                        />
                        {uploading && (
                          <div className="loader col">
                            <ClipLoader
                              size={30}
                              color={"#000"}
                              loading={uploading}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="col camera">
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Upload Image"
                          id="uploadFile"
                          onChange={(e) => uploadProductImageHandler(e)}
                          hidden
                          // onBlur={(e) => handleImageBlur(e)}
                        />
                        {uploading ? (
                          <div className="loader col">
                            <ClipLoader
                              size={30}
                              color={"#000"}
                              loading={uploading}
                            />
                          </div>
                        ) : (
                          <i class="fa-solid fa-camera"></i>
                        )}
                      </div>
                    )}
                  </label>
                </div>
                {errors.image && (
                  <h6 className="text-danger validation-error">
                    {errors.image}
                  </h6>
                )}
              </div>
              <div className="col-md-6 mt-3">
                <div className="inputField">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Product Name"
                    value={productData.name}
                    onChange={(e) => {
                      setProductData({
                        ...productData,
                        name: e.target.value,
                      });
                      handleNameBlur(e);
                    }}
                    onBlur={handleNameBlur}
                    disabled
                  />
                </div>
                {errors.name && (
                  <h6 className="text-danger validation-error">
                    {errors.name}
                  </h6>
                )}
              </div>
              <div className="col-md-6 mt-3">
                <div className="inputField">
                  <Select
                    name="colorTheme"
                    id="colorTheme"
                    value={
                      selectedColorTheme || {
                        value: productData?.theme,
                        label: productData?.theme,
                      }
                    }
                    onChange={handleColorThemeChange}
                    placeholder="Choose theme"
                    options={colorThemeOptions}
                    onBlur={handleThemeBlur}
                  />
                </div>
                {errors.theme && (
                  <h6 className="text-danger validation-error">
                    {errors.theme}
                  </h6>
                )}
              </div>

              {/* <div className="col-12 mt-3">
                <div className="inputField">
                  <Select
                    value={selectedCategoryOption || valueCategory}
                    onChange={handleChangeTrailerOptions}
                    options={productCategory?.map((option) => ({
                      value: option,
                      label: option.name,
                    }))}
                    placeholder="Trailer Number"
                    onBlur={handleCategoryBlur}
                  />
                </div>
                {errors.categoryId && (
                  <h6 className="text-danger validation-error mt-2">
                    {errors.categoryId}
                  </h6>
                )}
              </div> */}

              <div className="col-12 mt-3">
                <div className="inputField">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Origin"
                    value={productData.origin}
                    onChange={(e) => {
                      setProductData({
                        ...productData,
                        origin: e.target.value,
                      });
                      handleOriginBlur(e);
                    }}
                    onBlur={handleOriginBlur}
                  />
                </div>
                {errors.origin && (
                  <h6 className="text-danger validation-error">
                    {errors.origin}
                  </h6>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-border"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="button" className="btn" onClick={firstStepNext}>
                  Next
                </button>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            {/* Tab 1 */}
            <div className="row">
              <div className="col-12">
                <div className="newShipment">
                  <div className="container">
                    <Steps currentStep={currentStep} />
                  </div>
                </div>
                {/* -------- */}
                <div className="row">
                  <div className="col-12 my-2">
                    <div className="inputField">
                      {/* <Select
                        name="isOrganic"
                        id="isOrganic"
                        value={selectedIsOrganic}
                        onChange={handleIsOrganic}
                        placeholder="Organic"
                        options={isOrganicOptions}
                        onBlur={handleIsOrganicBlur}
                      /> */}

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Organic"
                        value={productData.isOrganic}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            isOrganic: e.target.value,
                          });
                          handleIsOrganicBlur(e);
                        }}
                        onBlur={handleIsOrganicBlur}
                      />

                      {/* <i className="fa-solid fa-chevron-down"></i> */}
                    </div>
                    {errors.isOrganic && (
                      <h6 className="text-danger validation-error">
                        {errors.isOrganic}
                      </h6>
                    )}
                  </div>
                  <div className="col-12 my-2">
                    <div className="inputField">
                      <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="5"
                        className="form-control"
                        placeholder="Description"
                        value={productData.organicDescription}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            organicDescription: e.target.value,
                          });
                          // handleOrganicDescriptionBlur(e);
                        }}
                        // onBlur={handleOrganicDescriptionBlur}
                      ></textarea>
                    </div>
                    {/* {errors.organicDescription && (
                      <h6 className="text-danger validation-error">
                        {errors.organicDescription}
                      </h6>
                    )} */}
                  </div>
                  <div className="col-md-6 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Approx. Transportation Days"
                        value={productData.transportationDays}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            transportationDays: e.target.value,
                          });
                          handleTransportationDaysBlur(e);
                        }}
                        onBlur={handleTransportationDaysBlur}
                      />
                    </div>
                    {errors.transportationDays && (
                      <h6 className="text-danger validation-error">
                        {errors.transportationDays}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-6 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Temperature"
                        value={productData.temperature}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            temperature: e.target.value,
                          });
                          handleTemperatureBlur(e);
                        }}
                        onBlur={handleTemperatureBlur}
                      />
                    </div>
                    {errors.temperature && (
                      <h6 className="text-danger validation-error">
                        {errors.temperature}
                      </h6>
                    )}
                  </div>
                </div>

                {/* ------- */}
                <div className="row my-4">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn-border me-3"
                      // data-bs-dismiss="modal"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={secondStepNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            {/* Tab 2 */}
            <div className="row">
              <div className="col-12">
                <div className="newShipment">
                  <div className="container">
                    <Steps currentStep={currentStep} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Calories"
                        value={productData.calories}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            calories: e.target.value,
                          });
                          handleCaloriesBlur(e);
                        }}
                        onBlur={handleCaloriesBlur}
                      />
                    </div>
                    {errors.calories && (
                      <h6 className="text-danger validation-error">
                        {errors.calories}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-6 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Water"
                        value={productData.water}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            water: e.target.value,
                          });
                          handleWaterBlur(e);
                        }}
                        onBlur={handleWaterBlur}
                      />
                    </div>
                    {errors.water && (
                      <h6 className="text-danger validation-error">
                        {errors.water}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-6 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Protein"
                        value={productData.protien}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            protien: e.target.value,
                          });
                          handleProtienBlur(e);
                        }}
                        onBlur={handleProtienBlur}
                      />
                    </div>
                    {errors.protien && (
                      <h6 className="text-danger validation-error">
                        {errors.protien}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-6 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Carbs"
                        value={productData.carbs}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            carbs: e.target.value,
                          });
                          handleCarbsBlur(e);
                        }}
                        onBlur={handleCarbsBlur}
                      />
                    </div>
                    {errors.carbs && (
                      <h6 className="text-danger validation-error">
                        {errors.carbs}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-4 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Sugar"
                        value={productData.sugar}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            sugar: e.target.value,
                          });
                          handleSugarBlur(e);
                        }}
                        onBlur={handleSugarBlur}
                      />
                    </div>
                    {errors.sugar && (
                      <h6 className="text-danger validation-error">
                        {errors.sugar}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-4 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Fiber"
                        value={productData.fiber}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            fiber: e.target.value,
                          });
                          handleFiberBlur(e);
                        }}
                        onBlur={handleFiberBlur}
                      />
                    </div>
                    {errors.fiber && (
                      <h6 className="text-danger validation-error">
                        {errors.fiber}
                      </h6>
                    )}
                  </div>
                  <div className="col-md-4 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Fat"
                        value={productData.fat}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            fat: e.target.value,
                          });
                          handleFatBlur(e);
                        }}
                        onBlur={handleFatBlur}
                      />
                    </div>
                    {errors.fat && (
                      <h6 className="text-danger validation-error">
                        {errors.fat}
                      </h6>
                    )}
                  </div>
                  <div className="col-12 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Storage Instruction"
                        value={productData.storageInst}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            storageInst: e.target.value,
                          });
                          handleStorageInstBlur(e);
                        }}
                        onBlur={handleStorageInstBlur}
                      />
                    </div>
                    {errors.storageInst && (
                      <h6 className="text-danger validation-error">
                        {errors.storageInst}
                      </h6>
                    )}
                  </div>
                  <div className="col-12 my-2">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Custom message"
                        value={productData.customMessage}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            customMessage: e.target.value,
                          });
                          handleCustomMessageBlur(e);
                        }}
                        onBlur={handleCustomMessageBlur}
                      />
                    </div>
                    {errors.customMessage && (
                      <h6 className="text-danger validation-error">
                        {errors.customMessage}
                      </h6>
                    )}
                  </div>
                </div>
                <div className="row my-4">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn-border me-3"
                      // data-bs-dismiss="modal"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={thirdStepNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            {/* Tab 3 */}
            <div className="row">
              <div className="col-12">
                <div className="newShipment">
                  <div className="container">
                    <Steps currentStep={currentStep} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 my-2">
                    <div className="inputField">
                      <label htmlFor="uploadFile" className="uploadImages">
                        Product Images
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Upload Image"
                          id="uploadFile"
                          multiple
                          onChange={(e) => uploadMultipleImageHandler(e)}
                          hidden
                          // onBlur={(e) => handleImageBlur(e)}
                        />
                        <i className="fa-solid fa-arrow-up-from-bracket"></i>
                      </label>
                    </div>
                  </div>
                  <div className="col-12 my-2 UploadedImage">
                    <div className="imageBox">
                      {productData?.productImages?.map((imageUrl, index) => (
                        <div className="image" key={index}>
                          <img src={imageUrl} alt="" />
                          <div
                            className="icon"
                            onClick={() => removeImage(index)}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 my-2">
                    <div className="inputField">
                      <textarea
                        name=""
                        id=""
                        cols="30"
                        rows="7"
                        className="form-control"
                        placeholder="Product Details "
                        value={productData.productDetail}
                        onChange={(e) => {
                          setProductData({
                            ...productData,
                            productDetail: e.target.value,
                          });
                          handleProductDetailBlur(e);
                        }}
                        onBlur={handleProductDetailBlur}
                      ></textarea>
                    </div>
                    {errors.productDetail && (
                      <h6 className="text-danger validation-error">
                        {errors.productDetail}
                      </h6>
                    )}
                  </div>
                </div>
                <div className="row my-4">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn-border me-3"
                      // data-bs-dismiss="modal"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={forthStepNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            {/* Tab 4 */}
            <div className="row">
              <div className="col-12">
                <div className="newShipment">
                  <div className="container">
                    <Steps currentStep={currentStep} />
                  </div>
                </div>

                <div className="row">
                  {/* <h4>Pickup</h4> */}
                  {productData?.timeline?.map((time, index) => (
                    <div className="col-12">
                      <h4 className="mt-2">Timeline {index + 1}</h4>
                      <div className="inputField mt-2">
                        <TimePicker
                          className="form-control"
                          placeholder="Processing Time"
                          value={
                            time?.processingTime
                              ? moment(time?.processingTime, "HH:mm")
                              : null
                          } // Convert the "HH:mm" time to a moment object or handle null time
                          onChange={(time) => {
                            handleTimeChangeReceiver(time, index);
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              processingTime: null,
                            }));
                          }}
                          showSecond={showSecond} // Hide seconds
                          format={showSecond ? "HH:mm:ss" : "HH:mm"} // Set the format based on showSecond
                          onFocus={() => {
                            if (ref7.current) {
                              ref7.current.input.readOnly = true;
                            }
                          }}
                          onBlur={() => {
                            if (ref7.current) {
                              ref7.current.input.readOnly = false;
                            }
                            // Handle onBlur actions if needed
                          }}
                          required
                        />
                      </div>
                      {index === Index && errors.processingTime && (
                        <div className="text-danger validation-error mt-2">
                          {errors.processingTime}
                        </div>
                      )}

                      <div className="inputField mt-2">
                        <DatePicker
                          className="form-control"
                          selected={
                            time?.processingDate
                              ? new Date(time?.processingDate)
                              : undefined
                          } // Use undefined when it's empty
                          onChange={(date) => {
                            handleDateChangeProcessingDate(date, index);
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              processingDate: null,
                            }));
                          }}
                          placeholderText="Processing Date"
                          onFocus={() => {
                            if (ref8.current) {
                              ref8.current.input.readOnly = true;
                            }
                          }}
                          onBlur={() => {
                            if (ref8.current) {
                              ref8.current.input.readOnly = false;
                            }
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              processingDate: null,
                            }));
                          }}
                          ref={ref8}
                          required
                        />

                        <img
                          src={CalenderIcon}
                          className="cal"
                          alt="Calendar Icon"
                          onClick={openDatePickerProcessingDate}
                        />
                      </div>
                      {index === Index && errors.processingDate && (
                        <div className="text-danger validation-error mt-2">
                          {errors.processingDate}
                        </div>
                      )}

                      <div className="inputField mt-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Location"
                          value={time?.location}
                          onChange={(e) => {
                            setProductData((prevState) => {
                              const updatedLocation = [...prevState.timeline];
                              updatedLocation[index].location = e.target.value;
                              return {
                                ...prevState,
                                timeline: updatedLocation,
                              };
                            });
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              location: null,
                            }));
                          }}
                          onBlur={() => handleTimelineLocationBlur(index)}
                        />
                      </div>
                      {index === Index && errors.location && (
                        <div className="text-danger validation-error mt-2">
                          {errors.location}
                        </div>
                      )}

                      <div className="inputField mt-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Status"
                          value={time?.status}
                          onChange={(e) => {
                            setProductData((prevState) => {
                              const updatedStatus = [...prevState.timeline];
                              updatedStatus[index].status = e.target.value;
                              return {
                                ...prevState,
                                timeline: updatedStatus,
                              };
                            });
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              status: null,
                            }));
                          }}
                          onBlur={() => handleTimelineStatusBlur(index)}
                        />
                      </div>
                      {index === Index && errors.status && (
                        <div className="text-danger validation-error mt-2">
                          {errors.status}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="row my-4">
                    <div className="col-12 text-end">
                      <button
                        type="button"
                        className="btn"
                        onClick={handleAddTimeline}
                      >
                        Add more
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-4">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn-border me-3"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-border me-3"
                      onClick={skipTimelineStep}
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      className="btn"
                      onClick={timelineStep}
                    >
                      Save & Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 6:
        return (
          <>
            {/* Tab 5 */}
            <div className="row">
              <div className="col-12">
                <div className="newShipment">
                  <div className="container">
                    <Steps currentStep={currentStep} />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 my-2">
                    <h4>QR Code</h4>
                    <p>
                      QR Code for access Product information like location,
                      temperature etc.
                    </p>
                    <div className="qr text-center">
                      <img
                        src={responseData ? responseData?.image : ""}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
                <div className="row my-4">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn me-3"
                      onClick={async () => {
                        if (responseData && responseData.image) {
                          try {
                            const response = await fetch(responseData.image);
                            const blob = await response.blob();
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
                    >
                      <i className="fa-solid fa-download"></i>
                    </button>

                    <button
                      type="button"
                      className="btn"
                      data-bs-dismiss="modal"
                      onClick={() => navigate(`/soiltable/${slug}`)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="SoiltableList">
      <div className="container-fluid">
        <HeaderComponent />
        <div className="row mx-sm-4 mx-0">
          <div className="col-12">
            <div className="UnitTop spaceBetween">
              <h4 className="text-capitalize">
                {Cookies.get("businessName")
                  ? JSON.parse(Cookies.get("businessName"))
                  : ""}
              </h4>
              <div className="flexEnd lGap">
                <button className="btn" onClick={() => openPopup()}>
                  Request New Category
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row mx-sm-4 mx-0 mt-30 mb-5">
          {loading === false && soiltableRequestCategory?.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // height: "100vh",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              No data to display
            </div>
          ) : null}

          {loading && soiltableRequestCategory.length === 0 ? (
            <div className="loader">
              <PropagateLoader
                cssOverride={override}
                size={15}
                color={"#000"}
                loading={loading}
              />
            </div>
          ) : (
            <InfiniteScroll
              dataLength={soiltableRequestCategory?.length}
              hasMore={hasMore}
              next={() => fetchDataOnScroll()}
              loader={
                soiltableRequestCategory?.length === 0 ||
                soiltableRequestCategory?.length === Length ? (
                  <div className="loader">
                    <ClipLoader size={30} color={"#000"} loading={loading} />
                  </div>
                ) : null
              }
              endMessage={
                <div className="row mt-4">
                  <div className="col text-center">
                    <p style={{ textAlign: "center" }}>
                      <b>
                        {soiltableRequestCategory?.length === 0
                          ? ""
                          : "Yay! You have seen it all"}
                      </b>
                    </p>
                  </div>
                </div>
              }
              style={{ display: "flex", flexWrap: "wrap" }} //define style here
              className="row"
            >
              {soiltableRequestCategory &&
                soiltableRequestCategory.map((data, index) => (
                  <div
                    key={index}
                    className="col-lg-2 col-md-3 col-sm-4 col-6 text-center mt-30 SolitableBox"
                  >
                    <div
                      className="SolitableImage"
                      // onClick={() =>
                      //   navigate(`/SolitableDetailList/${data?._id}`)
                      // }
                      onClick={() =>
                        setProductData({
                          ...productData,
                          name: data?.name,
                          categoryId: data?._id,
                        })
                      }
                      data-bs-toggle="modal"
                      data-bs-target="#addTimeline"
                    >
                      <img src={data?.image} alt="" />
                    </div>
                    <p className="mb-0 mt-15">{data?.name}</p>
                  </div>
                ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
      {JSON.parse(Cookies.get("role")) === 1 ? <ToolBoxAdmin /> : <ToolBox />}
      {isOpen && (
        <div className="popup-container" onClick={closePopupBlur}>
          <div className="popup" ref={popupRef}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Request New Category
                </h5>

                <button
                  type="button"
                  className="btn-closed"
                  onClick={() => closePopup()}
                  // data-bs-dismiss="modal"
                  // aria-label="Close"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12 profile">
                    <div className="uploadImage">
                      {categoryData?.image !== "" && (
                        <img
                          src={categoryData?.image}
                          alt=""
                          className="profile"
                        />
                      )}

                      {categoryData?.image === "" && (
                        <div
                          className="col camera"
                          style={{ marginLeft: "20px" }}
                          onClick={(e) => uploadImageHandler(e)}
                        >
                          <i class="fa-solid fa-camera"></i>
                        </div>
                      )}

                      <label htmlFor="uploadProfile">
                        <div className="iconBox">
                          <img
                            src="./assets/icons/editImage.svg"
                            alt=""
                            className="icon"
                          />
                        </div>
                        <input
                          type="file"
                          name=""
                          id="uploadProfile"
                          className="d-none"
                          onChange={uploadImageHandler}
                          onBlur={(e) => handleImageBlur(e)}
                        />
                        {uploading && (
                          <div className="loader">
                            <ClipLoader
                              size={30}
                              color={"#000"}
                              loading={uploading}
                            />
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.image && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.image}
                      </h6>
                    )}
                  </div>
                  <div className="col-12 mt-3">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={categoryData.name}
                        onChange={(e) => {
                          setCategoryData({
                            ...categoryData,
                            name: e.target.value,
                          });
                          handleNameBlur(e);
                        }}
                        onBlur={handleNameBlur}
                        required
                      />
                    </div>
                    {errors.name && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.name}
                      </h6>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-border me-3"
                  data-bs-dismiss="modal"
                  onClick={() => closePopup()}
                >
                  Back
                </button>

                <div data-bs-dismiss="modal">
                  <button type="button" className="btn" onClick={submitHandler}>
                    Request new Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className="modal fade"
        id="addTimeline"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            {currentStep === 1 && (
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add New Product
                </h5>

                <button
                  type="button"
                  className="btn-closed"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}
            {currentStep !== 1 && (
              <div className="modal-header">
                <div className="titleSection">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Product Details
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-closed"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            )}

            <div className="modal-body">{renderFormFields()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoiltableList;
