import '../style.scss';
import { MemoryRouter as Router } from 'react-router-dom';



export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  decorators: [(Story) => <Router><Story/></Router>]
}
