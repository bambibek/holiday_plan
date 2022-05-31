import { useState, useEffect, useCallback } from "react";

const usePublicHoliday = () => {
  const [publicHoliday, setPublicHoliday] = useState([]);
  const [error, setError] = useState(null);
  const fetchPublicHolidays = useCallback(async () => {
    try {
      const response = await fetch(
        "https://date.nager.at/Api/v3/PublicHolidays/2023/FI"
      );

      if (!response.ok) {
        throw new Error("NO Data received !!!");
      }
      const data = await response.json();
      setPublicHoliday(data);
    } catch (error) {
      setError(error);
    }
  }, []);

  // console.log(publicHoliday);
};

export default usePublicHoliday;
