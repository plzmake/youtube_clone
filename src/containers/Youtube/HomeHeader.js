import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu } from '../Header/menuApp';
//import './Header.scss';
import { fetchDataAutoCompleteHomeHeaderFromApi } from '../../utils/api';
import { SlMenu, } from "react-icons/sl";
import { IoIosSearch, IoMdMic, IoMdKeypad } from "react-icons/io";
import { RiVideoAddLine, RiKeyboardBoxFill, RiKeyboardLine, RiKeyboardFill } from "react-icons/ri";
import { FiBell } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import LogoYTB from '../../assets/images/images/ytb.svg'
import { Button } from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { withRouter } from "react-router";
class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {

            arrSelect: [],
            selectedVideo: `${(this.props.selectedVideo?.length > 0) ? this.props.selectedVideo : ""}`
        }

    }
    async componentDidMount() {
        if (this.props.selectedVideo?.length > 0) {
            let abc = await fetchDataAutoCompleteHomeHeaderFromApi(this.props.selectedVideo);
            let arrSelect = this.buildDataInputSelect(abc.results);
            console.log('arrselect', arrSelect)
            this.setState({
                arrSelect: arrSelect
            })
            console.log('api', abc)
        }

    }
    async componentDidUpdate(preProps, preState, snapshot) {
        if (preState.selectedVideo !== this.state.selectedVideo) {
            let abc = await fetchDataAutoCompleteHomeHeaderFromApi(this.state.selectedVideo);
            let arrSelect = this.buildDataInputSelect(abc.results);
            console.log("auto-complete", abc)
            console.log('arrselect', arrSelect)
            this.setState({
                arrSelect: arrSelect
            })
        }

    }

    handleSearch = () => {

        console.log('từ khóa đã chọn', this.state.selectedVideo)
        this.props.history.push(`/search/${this.state.selectedVideo.label}`, this.state.selectedVideo)
        this.setState({
            arrSelect: [],
            selectedVideo: ''
        })


    }
    buildDataInputSelect = (data) => {
        let result = [{ label: `${this.state.selectedVideo}`, value: `${this.state.selectedVideo}` }];

        if (data && data.length > 0) {
            data.map((item, index) => {
                let obj = {};

                obj.label = item;
                obj.value = item;
                result.push(obj)
            })

        }
        return result;

    }
    loadOptions = async (searchValue, callback) => {
        let test_arr = this.state.arrSelect;
        let filterOptions = test_arr;

        callback(filterOptions);
        this.setState({
            selectedVideo: searchValue
        })
        console.log('search value', searchValue)
        console.log('this.state.arrSelect trong load', test_arr)
        console.log('callback-new', filterOptions)
    }

    handleChange = selectedVideo => {
        console.log('selectvideo', selectedVideo)
        this.setState({ selectedVideo })
    }
    render() {
        //const { processLogout } = this.props;

        return (
            <div className="container-home-header">
                {/* thanh navigator */}
                <div className='first-header'>
                    <SlMenu className='icon-home-header' />
                    <Link to='/' className='img-LogoYTB'>
                        <img src={LogoYTB} alt='Youtube' />
                    </Link>
                </div>

                {/* nút logout */}
                <div className='mid-header'>
                    <button className='icon-search-header' ><IoIosSearch className='icon-home-header' /></button>
                    {/* <label htmlFor="previewImg">abcd<input onChange={(e) => { this.handleChange(e) }}
                        value={this.state.selectedVideo}
                    /></label>
                    <label htmlFor="previewImg">{'  '}</label> */}
                    <AsyncSelect //value={this.state.selectedVideo}
                        onChange={this.handleChange}
                        //options={this.state.arrSelect}
                        //className='form-control'
                        loadOptions={this.loadOptions}
                        defaultValue={this.state.arrSelect[0]}
                        placeholder={(this.state.selectedVideo.length > 0) ? this.state.selectedVideo : "Search"}
                    />

                    <RiKeyboardBoxFill className='search-icon-keypad' />

                    <button className='btn-search-header' onClick={() => this.handleSearch()} alt='tìm kiếm' ><IoIosSearch className='icon-home-header' /></button>
                    <button className='btn-mic-search'><IoMdMic className='icon-home-header mic' /></button>

                </div>
                <div className='end-header'>
                    <RiVideoAddLine className='icon-home-header' />
                    <FiBell className='icon-home-header' />
                    <button className='btn-name-search'>MN</button>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        //isLoggedIn: state.admin.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        //processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
