import axios from 'axios';
import Cookies from "js-cookie";

const baseURL = process.env.REACT_APP_BASEURL
const frontURL = process.env.REACT_APP_FRONTEND_URL
// const baseURL = staging.apiUrl+staging.PORT

const loginToken = Cookies.get('loginToken') ? JSON.parse(Cookies.get("loginToken")) : null;

const header = {
  headers: {
    Authorization: loginToken,
  },
};

export const login = async (data) => await axios.post(`${baseURL}/user/login`, data);
export const signup = async (data) => await axios.post(`${baseURL}/user/register`, data);
export const verifyToken = async (data) => await axios.put(`${baseURL}/user/email-verification`, data);
export const logout = async () => await axios.delete(`${baseURL}/user/logout`, header);
export const forgotPassword = async (data) => await axios.post(`${baseURL}/user/forgotpassword`, data);
export const resetPassword = async (data) => await axios.put(`${baseURL}/user/reset-password`, data);
export const validateToken = async (data) => await axios.put(`${baseURL}/user/validateToken`, data);



//unit
// eslint-disable-next-line no-unused-vars
let cancel

export const getUnitDetail = async (id) => await axios.get(`${baseURL}/truck/getDetail/${id}`, header)
export const fetchUnits = async (page , limit) => await axios.get(`${baseURL}/truck/getAllTrucks?limit=${limit}&page=${page}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const createUnit = async (data) => await  axios.post(`${baseURL}/truck/add`, data, header);
export const updateUnits = async (id, data) => await axios.put(`${baseURL}/truck/edit`,{...data, id: id}, header);
export const deleteUnit = async (id) => await axios.delete(`${baseURL}/truck/delete/${id}`, header);
export const updateCheckbox = async (dataId, checked) => await axios.put(`${baseURL}/truck/updateStatus`, { id: dataId, isActive: checked, }, header );
export const fetchUnitsSearch = async (page , limit, search) => await axios.get(`${baseURL}/truck/getAllTrucks?limit=${limit}&page=${page}&search=${search}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});

export const getTrailerDetail = async (id) => await axios.get(`${baseURL}/trailer/getDetail/${id}`, header)
export const fetchTrailers = async (page , limit) => await axios.get(`${baseURL}/trailer/getAllTrailer?limit=${limit}&page=${page}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const fetchTrailerSearch = async (page , limit, search) => await axios.get(`${baseURL}/trailer/getAllTrailer?limit=${limit}&page=${page}&search=${search}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const createTrailer = async (data) => await axios.post(`${baseURL}/trailer/add`, data, header);
export const updateTrailer = async (id, data) => await axios.put(`${baseURL}/trailer/edit`,{...data, id: id}, header);
export const deleteTrailer = async (id) => await axios.delete(`${baseURL}/trailer/delete/${id}`, header);
export const updateCheckboxTrailer = async (dataId, checked) => await axios.put(`${baseURL}/trailer/updateStatus`, { id: dataId, isActive: checked }, header );

export const fetchMapData = async (id) => await axios.get(`${baseURL}/trailer/getMapData/${id}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});

export const fetchMapDataDevice = async (id) => await axios.get(`${baseURL}/trailer/getDeviceMapData/${id}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});

export const getDriverDetail = async (id) => await axios.get(`${baseURL}/driver/detail-driver/${id}`, header)
export const fetchDrivers = async (page , limit, sortBy, sortValue) => await axios.get(`${baseURL}/driver/list-drivers?limit=${limit}&pageNum=${page}&sortBy=${sortBy}&sortValue=${sortValue}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const createDriver = async (data) => await  axios.post(`${baseURL}/driver/addDriver`, data, header);
export const updateDriver = async (id, data) => await axios.put(`${baseURL}/driver/update-driver`,{_id: id, ...data}, header);
export const deleteDriver = async (id) => await axios.delete(`${baseURL}/driver/delete-driver`, { headers: { Authorization: loginToken }, data:  { "userId": id } });
export const updateCheckboxDriver = async (dataId, checked) => await axios.put(`${baseURL}/driver/updateStatus`, { id: dataId, isActive: checked }, header );
export const fetchDriverSearch = async (page , limit, sortBy, sortValue, search) => await axios.get(`${baseURL}/driver/list-drivers?limit=${limit}&pageNum=${page}&sortBy=${sortBy}&sortValue=${sortValue}&search=${search}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});

export const getDeviceDetail = async (id) => await axios.get(`${baseURL}/device/getDetail/${id}`, header)
export const fetchDivices = async (page , limit) => await axios.get(`${baseURL}/device/list?limit=${limit}&page=${page}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const fetchSearchDevices = async (page , limit, search) => await axios.get(`${baseURL}/device/list?limit=${limit}&page=${page}&search=${search}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const assignDevice = async (data) => await  axios.put(`${baseURL}/device/assignSensor`, data, header);

export const createShipment = async (data) => await axios.post(`${baseURL}/shipment/addShipment`, data, header);
export const getShipmentDetail = async (id) => await axios.get(`${baseURL}/shipment/detail?id=${id}`);
export const fetchShipment = async (page , limit, sortBy, sortValue) => await axios.post(`${baseURL}/shipment/list`, { limit:limit, pageNum: page, sortBy: sortBy, sortValue: sortValue}, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );
export const fetchShipmentSearch = async (page , limit, sortBy, sortValue, search) => await axios.post(`${baseURL}/shipment/list`, { limit:limit, pageNum: page, sortBy: sortBy, sortValue: sortValue, search: search}, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );
export const fetchShipmentComplete = async (page , limit, sortBy, sortValue) => await axios.post(`${baseURL}/shipment/list`, { limit:limit, pageNum: page, sortBy: sortBy, sortValue: sortValue, status: "complete"}, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );
export const fetchShipmentCancel = async (page , limit, sortBy, sortValue) => await axios.post(`${baseURL}/shipment/list`, { limit:limit, pageNum: page, sortBy: sortBy, sortValue: sortValue, status: "cancel"}, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );
export const updateShipment = async (id, data) => await axios.put(`${baseURL}/shipment/updateShipment`,{id: id, ...data}, header);

export const getProfileDetail = async () => await axios.get(`${baseURL}/user/get-profile`, header)
export const updateProfile = async (data) => await axios.patch(`${baseURL}/user/update-profile`,data, header);

export const fetchSoiltableCategory = async (page , limit) => await axios.get(`${baseURL}/soiltable/userCategory?page=${page}&limit=${limit}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );
export const fetchRequestSoiltableCategory = async (page , limit) => await axios.get(`${baseURL}/category/listRequest?page=${page}&limit=${limit}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );
export const fetchRequestSoiltableCategoryAdmin = async (page , limit) => await axios.get(`${baseURL}/category/list?page=${page}&limit=${limit}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );
export const fetchSoiltable = async (page , limit, categoryId) => await axios.get(`${baseURL}/soiltable/list?categoryId=${categoryId}&limit=${limit}&page=${page}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );

export const fetchQRcode = async (page , limit) => await axios.get(`${baseURL}/qrcode/list?page=${page}&limit=${limit}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );

export const createEvent = async (id, data) => await axios.post(`${baseURL}/trailer/addEvent`, {trailerId: id, ...data}, header);
export const updateTrailerHour = async (id, resetHours) => await axios.put(`${baseURL}/trailer/resetHour`,{id: id, engineHours: resetHours}, header);

export const requestSoiltableCategory = async (data) => await  axios.post(`${baseURL}/category/request`, data, header);
export const createSoiltableCategory = async (data) => await  axios.post(`${baseURL}/category/add`, data, header);
export const approveRequestStatus = async (data) => await  axios.put(`${baseURL}/category/updateStatus`, data, header);
export const approveRequestCat = async (data) => await  axios.put(`${baseURL}/category/approveRequestCat`, data, header);
export const getSoiltableCategoryDetail = async (id) => await axios.get(`${baseURL}/category/detail/${id}`, header);
export const getSoiltableDetail = async (id) => await axios.get(`${baseURL}/soiltable/detail?id=${id}`);
export const updateSoiltableCatagory = async (data) => await axios.put(`${baseURL}/category/edit`,data , header);
export const deleteSoiltableCatagory = async (id) => await axios.delete(`${baseURL}/category/delete/${id}`, header);

export const createSoiltableProduct = async (data) => await  axios.post(`${baseURL}/soiltable/add`, data, header);

export const createSoiltableTimeline = async (id, data) => await  axios.post(`${baseURL}/soiltable/addTimeline`, {...data, id: id}, header);

export const requestNewProduct = async (data) => await  axios.post(`${baseURL}/soiltable/add`, data, header);

export const fetchCustomers = async (page , limit, role) => await axios.get(`${baseURL}/user/getAllUsers?limit=${limit}&page=${page}&role=${role}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const fetchCustomersAll = async (page , limit) => await axios.get(`${baseURL}/user/getAllUsers?limit=${limit}&page=${page}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const getCustomerDetail = async (id) => await axios.get(`${baseURL}/user/getDetail/${id}`, header)
export const createCustomer = async (data) => await  axios.post(`${baseURL}/user/addUser`, data);
export const updateCustomer = async (id, data) => await axios.patch(`${baseURL}/user/update-user`,{id: id, ...data}, header);

export const fetchSearchCustomers = async (page , limit, search) => await axios.get(`${baseURL}/user/getAllUsers?limit=${limit}&page=${page}&search=${search}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});

export const fetchAlarms = async (page , limit, status) => await axios.post(`${baseURL}/shipment/listAlarm`, { limit:limit, page: page, status: status}, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );

export const downloadXLS = async (id) => await axios.post(`${baseURL}/shipment/downloadXls`,{ id: id }, header);
export const downloadXLSTrailer = async (id) => await axios.post(`${baseURL}/trailer/downloadXls`,{ id: id }, header);
export const downloadXLSDevice = async (id) => await axios.post(`${baseURL}/device/downloadXls`,{ id: id }, header);

export const getDashboard = async () => await axios.get(`${baseURL}/user/dashboard`, header);

export const fetchInbox = async (page , limit) => await axios.get(`${baseURL}/chat/getInbox?limit=${limit}&page=${page}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const fetchSearchUserNGroup = async (page , limit, search) => await axios.get(`${baseURL}/chat/getAllUsers?limit=${limit}&page=${page}&search=${search}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});

export const fetchMessages = async (page , limit, threadId) => await axios.get(`${baseURL}/chat/messageListing?limit=${limit}&page=${page}&threadId=${threadId}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)});
export const createGroup = async (data) => await  axios.post(`${baseURL}/chat/createGroup`, data, header);
export const clearChat = async (id) => await axios.post(`${baseURL}/chat/clearChat`,{ threadId: id } , header);
export const clearChatGroup = async (id, threadId) => await axios.post(`${baseURL}/chat/clearChat`,{ threadId: threadId, groupId: id } , header);
  
// export const sendShipmentMail = async (id, data, temp) => await axios.post(`${baseURL}/shipment/shareLink`, {email: data, url: temp === true ? `${frontURL}/Shipment-moreinfo/${id}` : `${frontURL}/Shipment-moreinfo-notemp/${id}`}  );
export const sendShipmentMail = async (id, data, temp) => {
  let url;

  switch (temp) {
    case 'ShipmentMoreinfo':
      url = `${frontURL}/Shipment-moreinfo/${id}`;
      break;
    case 'ShipmentMoreinfoNotemp':
      url = `${frontURL}/Shipment-moreinfo-notemp/${id}`;
      break;
    case 'CompleteShipmentMoreinfo':
      url = `${frontURL}/complete-shipment-moreinfo/${id}`;
      break;
    case 'CompleteShipmentMoreinfoNotemp':
      url = `${frontURL}/complete-shipment-moreinfo-notemp/${id}`;
      break;
    default:
      url = `${frontURL}/Shipment-moreinfo/${id}`;
  }

  return await axios.post(`${baseURL}/shipment/shareLink`, { email: data, url });
};


export const changePassword = async (data) => await  axios.post(`${baseURL}/user/change-password`, data, header);

export const notificationSettings = async (data) => await  axios.post(`${baseURL}/user/updateNotificationSetting`, data, header);

export const fetchNotificationList = async (page , limit) => await axios.get(`${baseURL}/notification/list?limit=${limit}&page=${page}`, header);
export const readNotification = async (id) => await axios.put(`${baseURL}/notification/markAsRead`, {id: id}, header);
export const clearNotification = async () => await axios.put(`${baseURL}/notification/clearNotification`,{}, header);
export const listNotifications = async (page , limit) => await axios.get(`${baseURL}/notification/getAll?limit=${limit}&page=${page}`, header, {cancleToken: new axios.CancelToken(c=> cancel = c)} );

export const editRequestCategory = async (data) => await axios.put(`${baseURL}/category/editRequestCat`, data, header);
export const editSoiltableProduct = async (data) => await  axios.put(`${baseURL}/soiltable/edit`, data, header);
export const approveSoiltableProduct = async (dataId, checked) => await axios.put(`${baseURL}/soiltable/approveProduct`, { id: dataId, status: checked, }, header );

export const fetchThreadId = async (data) => await axios.get(`${baseURL}/chat/findThreadId?userId=${data}`, header);

// axios.delete(`${baseURL}/driver/delete-driver`, {
//   headers: {
//     Authorization: loginToken
//   },
//   data: {
//     source: { "userId": id }
//   }
// });
