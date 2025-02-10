//@ts-nocheck
import { useAppDispatch, useAppSelector } from "../store/hooks";

const CompanyChanger = () => {
  const { companies, selectedCompany } = useAppSelector(
    (state) => state.company
  );

  const dispatch = useAppDispatch();
  return (
    <div className="company-changer">
      <div className="company-changer__selected">
        <span>Selected Company:</span>
        <span>{selectedCompany?.companyName}</span>
      </div>
      <div className="company-changer__divider"></div>
      <div className="company-changer__label">Change Company:</div>
      <div className="company-changer__select">
        <label htmlFor="company">Company:</label>
        <select id="company" name="company">
          {companies!.map((company) => (
            <option value={company.id} key={company.id}>
              {company.companyName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default CompanyChanger;
