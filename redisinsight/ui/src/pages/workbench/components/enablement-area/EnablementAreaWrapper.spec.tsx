import React from 'react'
import { cloneDeep } from 'lodash'
import { instance, mock } from 'ts-mockito'
import { cleanup, clearStoreActions, mockedStore, render } from 'uiSrc/utils/test-utils'
import { getWBGuides } from 'uiSrc/slices/workbench/wb-guides'
import { getWBTutorials } from 'uiSrc/slices/workbench/wb-tutorials'
import EnablementAreaWrapper, { Props } from './EnablementAreaWrapper'

const mockedProps = mock<Props>()

let store: typeof mockedStore

beforeEach(() => {
  cleanup()
  store = cloneDeep(mockedStore)
  store.clearActions()
})

jest.mock('uiSrc/slices/workbench/wb-guides', () => {
  const defaultState = jest.requireActual('uiSrc/slices/workbench/wb-guides').initialState
  return {
    ...jest.requireActual('uiSrc/slices/workbench/wb-guides'),
    workbenchGuidesSelector: jest.fn().mockReturnValue({
      ...defaultState,
    }),
  }
})

jest.mock('uiSrc/slices/workbench/wb-tutorials', () => {
  const defaultState = jest.requireActual('uiSrc/slices/workbench/wb-tutorials').initialState
  return {
    ...jest.requireActual('uiSrc/slices/workbench/wb-tutorials'),
    workbenchTutorialsSelector: jest.fn().mockReturnValue({
      ...defaultState,
    }),
  }
})

describe('EnablementAreaWrapper', () => {
  it('should render and call getWBGuides and getWBTutorials actions', () => {
    const expectedActions = [getWBGuides(), getWBTutorials()]

    expect(render(<EnablementAreaWrapper {...instance(mockedProps)} />)).toBeTruthy()
    expect(clearStoreActions(store.getActions().slice(0, expectedActions.length))).toEqual(
      clearStoreActions(expectedActions)
    )
  })
})
