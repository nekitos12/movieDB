import React from 'react';
import './film-list-pagination.css'
import {Pagination} from "antd";
import PropTypes from "prop-types";

function FilmListPagination ({total, onChange, defaultCurrent}) {
  return (
    <div className="film-list-pagination">
      <Pagination defaultPageSize={20}  size="small" total={total} onChange={onChange} defaultCurrent={defaultCurrent}/>
    </div>
  )
}

FilmListPagination.defaultProps = {
  total: 1,
  currentPage: 1,
}
FilmListPagination.propTypes = {
  total: PropTypes.number,
  currentPage: PropTypes.number,
  onChange: PropTypes.func.isRequired,
}


export default FilmListPagination
