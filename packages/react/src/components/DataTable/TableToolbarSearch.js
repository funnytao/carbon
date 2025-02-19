/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';
import { settings } from 'carbon-components';
import Search from '../Search';
import setupGetInstanceId from './tools/instanceId';
import deprecate from '../../prop-types/deprecate';

const { prefix } = settings;
const getInstanceId = setupGetInstanceId();
const translationKeys = {
  'carbon.table.toolbar.search.label': 'Filter table',
  'carbon.table.toolbar.search.placeholder': 'Filter table',
};
const translateWithId = id => {
  return translationKeys[id];
};
const TableToolbarSearch = ({
  className,
  searchContainerClass,
  onChange: onChangeProp,
  translateWithId: t,
  placeHolderText,
  labelText,
  expanded: expandedProp,
  defaultExpanded,
  onExpand,
  persistent,
  persistant,
  id = `data-table-search-${getInstanceId()}`,
  ...rest
}) => {
  const { current: controlled } = useRef(expandedProp !== undefined);
  const [expandedState, setExpandedState] = useState(defaultExpanded);
  const expanded = controlled ? expandedProp : expandedState;
  const searchRef = useRef(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.querySelector('input').focus();
    }
  });

  const searchContainerClasses = cx({
    [searchContainerClass]: searchContainerClass,
    [`${prefix}--toolbar-action`]: true,
    [`${prefix}--toolbar-search-container-active`]: expanded,
    [`${prefix}--toolbar-search-container-expandable`]:
      !persistent || (!persistent && !persistant),
    [`${prefix}--toolbar-search-container-persistent`]:
      persistent || persistant,
  });

  const searchClasses = cx({
    className,
    [`${prefix}--search-maginfier`]: true,
  });

  const handleExpand = (event, value = !expanded) => {
    const searchContainer = searchRef && searchRef.current;
    if (searchContainer) {
      if (value) {
        searchRef.current.setAttribute('tabIndex', '-1')
      }
      else {
        searchRef.current.setAttribute('tabIndex', '0')
      }
    }
    if (!controlled && (!persistent || (!persistent && !persistant))) {
      setExpandedState(value);
    }
    if (onExpand) {
      onExpand(event, value);
    }
  };

  const onChange = e => {
    setValue(e.target.value);
    if (onChangeProp) {
      onChangeProp(e);
    }
  };

  return (
    <div
      tabIndex="0"
      role="searchbox"
      ref={searchRef}
      onClick={event => handleExpand(event, true)}
      onFocus={event => handleExpand(event, true)}
      onBlur={event => !value && handleExpand(event, false)}
      className={searchContainerClasses}>
      <Search
        {...rest}
        small
        className={searchClasses}
        value={value}
        id={id}
        aria-hidden={!expanded}
        labelText={labelText || t('carbon.table.toolbar.search.label')}
        placeHolderText={
          placeHolderText || t('carbon.table.toolbar.search.placeholder')
        }
        onChange={onChange}
      />
    </div>
  );
};

TableToolbarSearch.propTypes = {
  children: PropTypes.node,

  /**
   * Provide an optional class name for the search container
   */
  className: PropTypes.string,

  /**
   * Provide an optional id for the search container
   */
  id: PropTypes.string,

  /**
   * Provide an optional className for the overal container of the Search
   */
  searchContainerClasses: PropTypes.string,

  /**
   * Provide an optional hook that is called each time the input is updated
   */
  onChange: PropTypes.func,

  /**
   * Provide an optional placeholder text for the Search component
   */
  placeHolderText: PropTypes.string,

  /**
   * Provide an optional label text for the Search component icon
   */
  labelText: PropTypes.string,

  /**
   * Provide custom text for the component for each translation id
   */
  translateWithId: PropTypes.func.isRequired,

  /**
   * Whether the search should be allowed to expand
   */
  persistent: PropTypes.bool,
  persistant: deprecate(
    PropTypes.bool,
    `\nThe prop \`persistant\` for TableToolbarSearch has been deprecated in favor of \`persistent\`. Please use \`persistent\` instead.`
  ),
};

TableToolbarSearch.defaultProps = {
  translateWithId,
  persistent: false,
};

export default TableToolbarSearch;
