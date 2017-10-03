/**
 * Debouncer wrapper
 */
class Debounce {

    /**
     * Debounce function - no more spamming
     * @param  {Function} func      - Function to debounce
     * @param  {Number}   wait      - Time to wait (ms)
     * @param  {Boolean}  immediate - If true, runs immediately
     * @return {Function}           - The debounce activation function
     */
    run(func, wait, immediate) {
        let context = this;

        return function () {
            var later = () => {
                context.timeout = null;
                if (!immediate) {
                    func.apply(context, arguments);
                }
            };
            var callNow = immediate && !context.timeout;
            clearTimeout(context.timeout);
            context.timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, arguments);
            }
        };
    }
}
