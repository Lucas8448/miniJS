// Inside src/app.js
import mini from './mini';

export const MyComponent = {
    render() {
        return `
            <div>
                <h1>Main Component</h1>
                <nav>
                    <a href="#/">Home</a>
                    <a href="#/list">List</a>
                </nav>
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
            <ul>
                ${this.data.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }
};

mini.route('/', MyComponent);
mini.route('/list', MyListComponent);