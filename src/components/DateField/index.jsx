import { CalendarIcon } from "../Icons";
import "./style.css";

export default function DateField({ value, onChange, className = "", ...props }) {
  return (
    <div className={`date-field ${className}`}>
      <CalendarIcon width={16} height={16} className="date-field-icon" />
      <input type="date" value={value} onChange={onChange} {...props} />
    </div>
  );
}
