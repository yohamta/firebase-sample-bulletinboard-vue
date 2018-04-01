import moment from 'moment-timezone';
import 'moment/locale/en-gb';
export default {
    methods: {
        formatDate(date) {
          return moment.tz(date, "Asia/Tokyo").format("YYYY/MM/DD ddd HH:mm:ss")
        },
    }
};