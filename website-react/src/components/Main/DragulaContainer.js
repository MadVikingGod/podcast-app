import React, { Component } from 'react'
import Dragula from 'react-dragula'

import { actions } from 'mirrorx'

class DragulaContainer extends Component {
  constructor (props) {
    super(props)
    this.dragulaDecorator = this.dragulaDecorator.bind(this)
  }

  render () {
    return (
      <div
        id='queue'
        ref={this.dragulaDecorator}
      >
        {this.props.children}
      </div>
    )
  }

  dragulaDecorator (componentBackingInstance) {
    if (componentBackingInstance) {
      const options = {}
      const drake = Dragula([componentBackingInstance], options)
      drake.on('drop', (el, target, source, sibling) => {
        const episodeId = this.props.children.find(c => c.key === el.id).key

        // what does order of list look like without selected element?
        const freshList = this.props.children.filter(c => c.key !== el.id)

        // get new index based on where sibling element is in the above list
        // (null sibling means element moved to last place)
        const movedIndex = sibling === null ? null : freshList.findIndex(epi => epi.key === sibling.id)
        actions.player.resortPlaylist({ episodeId, movedIndex })
      })
    }
  }
}

export default DragulaContainer
