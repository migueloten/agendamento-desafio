export function dateBR(date?: string) {
	if (!date) return "";

	if (date.includes("T")) {
		let [day, time] = date.split("T");
		let [year, month, dayNum] = day.split("-").map(e => parseInt(e));
		let [hour, minute, second] = time.split(":").map(e => parseInt(e));

		return new Date(year, month - 1, dayNum, hour, minute, second).toLocaleString("pt-BR");
	} else {
		let [year, month, dayNum] = date.split("-").map(e => parseInt(e));

		return new Date(year, month - 1, dayNum).toLocaleDateString("pt-BR");
	}
}