import styles from './LargeList.less';

import React, { Component } from 'react';
import isMobile from 'ismobilejs';
import Link from 'Link/Link';
import Autosuggest from 'Autosuggest';
import { escapeRegexCharacters } from 'utils/utils';

const list = Array.from({ length: 5000 }).map((_item, i) => ({
  id: i,
  name: `ListItem ${i}`,
}));

const focusInputOnSuggestionClick = !isMobile.any;

const getSuggestions = (value) => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return list.filter((language) => regex.test(language.name));
};

const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = (suggestion) => <span>{suggestion.name}</span>;

export default class LargeList extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type 'list'",
      value,
      onChange: this.onChange,
    };

    return (
      <div id="basic-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>Large List</div>
          <div className={styles.description}>
            Let’s start simple. Here’s a plain list of suggestions.
          </div>
          <Link
            className={styles.codepenLink}
            href="http://codepen.io/moroshko/pen/LGNJMy"
            underline={false}
          >
            Codepen
          </Link>
        </div>
        <div className={styles.autosuggest}>
          <Autosuggest
            alwaysRenderSuggestions={true}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            focusInputOnSuggestionClick={focusInputOnSuggestionClick}
            id="basic-example"
            largeList={true}
            largeListHeight={144}
            largeListItemCount={list.length}
            largeListItemSize={48}
            width="100%"
          />
        </div>
      </div>
    );
  }
}
