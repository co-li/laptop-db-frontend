import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
  

import './index.css';

const apiURL = 'http://localhost:3001'

function LaptopListing(props) {
    return(
        <div className="laptop-listing" key={props.model_id}>
            <Link to={`/${props.model_id}`}>
                <img src={props.images[0]} className="laptop-thumbnail" alt="laptop thumbnail"/>
                <p>{props.brand} {props.model_name}</p>
            </Link>
        </div>
    )
}

class LaptopList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            laptops: [],
        }
    }
    
    componentDidMount() {
        axios.get(apiURL + '/models')
            .then(res => {
                const laptops = res.data;
                this.setState({ laptops: laptops });
            })
    }

    render() {
        return (
            <div className="laptop-list">
                { this.state.laptops.map(laptop => LaptopListing(laptop)) }
            </div>
        )
    }
}

function LaptopOverview(props) { 
    return(
        <div className="laptop-overview">
            <h1>{props.brand} {props.model_name}</h1>
            {props.images && props.images.length > 0 &&
                <img src={props.images[0]} className="laptop-gallery"/>
            }
        </div>
    )
}

function LaptopConfiguration(props) {
    return(
        <div className="laptop-config" key={props.config_id}>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href=props.url;
                }}
            >Buy</button    >
            <p>CPU: {props.cpu_model}</p>
            <p>RAM: {props.ram}</p>
            <p>Storage: {props.storage_size} {props.storage_type}</p>
            <p>Graphics: {props.graphics}</p>
            <p>Model Number: {props.product_number}</p>
        </div>
    )
}

class LaptopDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: {},
            configurations: [],
        }
    }

    componentDidMount() {
        axios.get(apiURL + `/models/${this.props.match.params.model_id}`)
            .then(res => {
                const model_data = res.data[0];
                this.setState({ model: model_data})
            })
        axios.get(apiURL + `/models/${this.props.match.params.model_id}/configurations`)
            .then(res => {
                const configs = res.data;
                this.setState({ configurations: configs });
            })
    }

    render() {
        return (
            <div className="laptop-detail">
                { LaptopOverview(this.state.model) }
                { this.state.configurations.map(config => LaptopConfiguration(config)) }
            </div>
        )
    }
}

function main() {
    ReactDOM.render(
        <Router>
            <Switch>
                <Route path="/:model_id" component={LaptopDetails} />
                <Route path="/">
                    <LaptopList />
                </Route>
            </Switch>
        </Router>,
        document.getElementById('root')
    );
}

main();