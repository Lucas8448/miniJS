import mini from './mini';
import { Navbar } from './navbar';

export const MyComponent = {
  render() {
    return `
      <div>
        ${Navbar.render()}
        <h1>Main Component</h1>
      </div>
    `;
  }
};

export const MyListComponent = {
  data: {
    items: ['Item 1', 'Item 2', 'Item 3']
  },
  render() {
    return `
      <div>
        ${Navbar.render()}
        <ul>
          ${this.data.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }
};

mini.route('/', MyComponent);
mini.route('/list', MyListComponent);
