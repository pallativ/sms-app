
const ToDateTime = (seconds) => {
    const date = new Date(seconds * 1000); // Convert seconds to milliseconds
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }).format(date);
    //console.log(formattedDate);
    return formattedDate;

};
export { ToDateTime };

