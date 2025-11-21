import { format, isToday, isTomorrow, isPast, isThisWeek, startOfDay } from "date-fns";

export const formatDueDate = (date) => {
  if (!date) return "";
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return "Today";
  } else if (isTomorrow(dateObj)) {
    return "Tomorrow";
  } else if (isThisWeek(dateObj)) {
    return format(dateObj, "EEEE");
  } else {
    return format(dateObj, "MMM dd");
  }
};

export const getDueDateStatus = (date) => {
  if (!date) return "none";
  
  const dateObj = startOfDay(new Date(date));
  const today = startOfDay(new Date());
  
  if (isPast(dateObj) && !isToday(dateObj)) {
    return "overdue";
  } else if (isToday(dateObj) || isTomorrow(dateObj)) {
    return "soon";
  } else {
    return "upcoming";
  }
};

export const formatDateForInput = (date) => {
  if (!date) return "";
  return format(new Date(date), "yyyy-MM-dd");
};