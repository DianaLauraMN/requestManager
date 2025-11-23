export const getEndStartDateTyped = (eventDate: string, startTime: string | undefined, endTime: string | undefined) => {
    let doesEventFinishNextDay = false;

    const eventDateTyped = new Date(eventDate);
    eventDateTyped.setUTCHours(0, 0, 0, 0);

    const startDate = new Date(eventDateTyped.toISOString());
    const endDate = new Date(eventDateTyped.toISOString());

    const startTimeSplited = startTime?.split(":");
    const endTimeSplitted = endTime?.split(":");

    if (startTimeSplited?.length) {
        startDate.setUTCHours(Number(startTimeSplited[0]), Number(startTimeSplited[1]), 0, 0);
    }

    if (endTimeSplitted?.length) {
        if (startTimeSplited?.length) {
            doesEventFinishNextDay = Number(endTimeSplitted[0]) <= Number(startTimeSplited[0]) ? true : false;
        }

        if (doesEventFinishNextDay) {
            endDate.setTime(eventDateTyped.getTime() + 86400000)
        }
        endDate.setUTCHours(Number(endTimeSplitted[0]), Number(endTimeSplitted[1]), 0, 0);
    }

    const datesTyped = {
        eventDateTyped,
        startDate: startTime ? startDate : null,
        endDate: endTime ? endDate : null
    }
    
    return datesTyped;
}

