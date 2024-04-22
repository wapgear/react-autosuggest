import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from './Item';
import compareObjects from './compareObjects';
import { FixedSizeList as List } from 'react-window';

export default class ItemsList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    itemProps: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    renderItem: PropTypes.func.isRequired,
    renderItemData: PropTypes.object.isRequired,
    sectionIndex: PropTypes.number,
    highlightedItemIndex: PropTypes.number,
    onHighlightedItemChange: PropTypes.func.isRequired,
    getItemId: PropTypes.func.isRequired,
    theme: PropTypes.func.isRequired,
    keyPrefix: PropTypes.string.isRequired,
    largeList: false,
    largeListHeight: 200,
    largeListItemCount: 10,
    largeListItemSize: 50,
    largeListItemWidth: '100%',
  };

  static defaultProps = {
    sectionIndex: null,
  };

  shouldComponentUpdate(nextProps) {
    return compareObjects(nextProps, this.props, ['itemProps']);
  }

  storeHighlightedItemReference = (highlightedItem) => {
    this.props.onHighlightedItemChange(
      highlightedItem === null ? null : highlightedItem.item
    );
  };

  render() {
    const {
      items,
      itemProps,
      renderItem,
      renderItemData,
      sectionIndex,
      highlightedItemIndex,
      getItemId,
      theme,
      keyPrefix,
    } = this.props;
    const sectionPrefix =
      sectionIndex === null
        ? keyPrefix
        : `${keyPrefix}section-${sectionIndex}-`;
    const isItemPropsFunction = typeof itemProps === 'function';

    const _renderItem = (item, itemIndex, extraProps) => {
      const isFirst = itemIndex === 0;
      const isHighlighted = itemIndex === highlightedItemIndex;
      const itemKey = `${sectionPrefix}item-${itemIndex}`;
      const itemPropsObj = isItemPropsFunction
        ? itemProps({ sectionIndex, itemIndex })
        : itemProps;
      const allItemProps = {
        id: getItemId(sectionIndex, itemIndex),
        'aria-selected': isHighlighted,
        ...theme(
          itemKey,
          'item',
          isFirst && 'itemFirst',
          isHighlighted && 'itemHighlighted'
        ),
        ...itemPropsObj,
      };

      if (isHighlighted) {
        allItemProps.ref = this.storeHighlightedItemReference;
      }

      // `key` is provided by theme()
      /* eslint-disable react/jsx-key */
      return (
        <Item
          {...allItemProps}
          sectionIndex={sectionIndex}
          isHighlighted={isHighlighted}
          itemIndex={itemIndex}
          item={item}
          renderItem={renderItem}
          renderItemData={renderItemData}
          {...extraProps}
        />
      );
      /* eslint-enable react/jsx-key */
    };

    if (this.props.largeList) {
      return (
        <List
          height={this.props.largeListHeight}
          itemCount={this.props.largeListItemCount}
          itemSize={this.props.largeListItemSize}
          width={this.props.largeListItemWidth}
          className="autosuggest__large-list"
        >
          {({ index: itemIndex, style }) => {
            const item = items[itemIndex];

            return _renderItem(item, itemIndex, {
              style,
            });
          }}
        </List>
      );
    }

    return (
      <ul role="listbox" {...theme(`${sectionPrefix}items-list`, 'itemsList')}>
        {items.map((item, itemIndex) => {
          return _renderItem(item, itemIndex);
        })}
      </ul>
    );
  }
}
