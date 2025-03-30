import { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import { retrieveTickets, deleteTicket } from '../api/ticketAPI';
import ErrorPage from './ErrorPage';
import Swimlane from '../components/Swimlane';
import { TicketData } from '../interfaces/TicketData';
import { ApiMessage } from '../interfaces/ApiMessage';

import auth from '../utils/auth';

const boardStates = ['Todo', 'In Progress', 'Done'];

type SortField = 'name' | 'description' | 'status' | 'assignedUserId';
type SortDirection = 'asc' | 'desc';

const Board = () => {
  const [allTickets, setAllTickets] = useState<TicketData[]>([]);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterText, setFilterText] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const checkLogin = () => {
    if(auth.loggedIn()) {
      setLoginCheck(true);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await retrieveTickets();
      setAllTickets(data);
      applyFiltersAndSort(data);
    } catch (err) {
      console.error('Failed to retrieve tickets:', err);
      setError(true);
    }
  };

  const applyFiltersAndSort = (ticketsToProcess: TicketData[] = allTickets) => {
    let filteredTickets = [...ticketsToProcess];
    
    if (filterText) {
      const searchTermLower = filterText.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket => 
        (ticket.name?.toLowerCase() || '').includes(searchTermLower) || 
        (ticket.description?.toLowerCase() || '').includes(searchTermLower)
      );
    }
    
    if (priorityFilter !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.status === priorityFilter
      );
    }
    
    filteredTickets.sort((a, b) => {
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' 
          ? fieldA - fieldB
          : fieldB - fieldA;
      }
      
      return 0;
    });
    
    setTickets(filteredTickets);
  };

  const deleteIndvTicket = async (ticketId: number) : Promise<ApiMessage> => {
    try {
      const data = await deleteTicket(ticketId);
      fetchTickets();
      return data;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  useLayoutEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if(loginCheck) {
      fetchTickets();
    }
  }, [loginCheck]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filterText, priorityFilter, sortField, sortDirection]);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
    {
      !loginCheck ? (
        <div className='login-notice'>
          <h1>
            Login to create & view tickets
          </h1>
        </div>  
      ) : (
          <div className='board'>
            <div className='board-controls'>
              <button type='button' id='create-ticket-link'>
                <Link to='/create'>New Ticket</Link>
              </button>
              
              <div className='filter-sort-controls'>
                <div className='filter-controls'>
                  <input 
                    type='text' 
                    placeholder='Search tickets...' 
                    value={filterText} 
                    onChange={(e) => setFilterText(e.target.value)} 
                    className='filter-input'
                  />
                  
                  <select 
                    value={priorityFilter} 
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className='priority-filter'
                  >
                    <option value='all'>All Statuses</option>
                    <option value='Todo'>Todo</option>
                    <option value='In Progress'>In Progress</option>
                    <option value='Done'>Done</option>
                  </select>
                </div>
                
                <div className='sort-controls'>
                  <select 
                    value={sortField} 
                    onChange={(e) => setSortField(e.target.value as SortField)}
                    className='sort-field'
                  >
                    <option value='name'>Name</option>
                    <option value='description'>Description</option>
                    <option value='status'>Status</option>
                    <option value='assignedUserId'>Assignee</option>
                  </select>
                  
                  <select 
                    value={sortDirection} 
                    onChange={(e) => setSortDirection(e.target.value as SortDirection)}
                    className='sort-direction'
                  >
                    <option value='asc'>Ascending</option>
                    <option value='desc'>Descending</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className='board-display'>
              {boardStates.map((status) => {
                const filteredTickets = tickets.filter(ticket => ticket.status === status);
                return (
                  <Swimlane 
                    title={status} 
                    key={status} 
                    tickets={filteredTickets} 
                    deleteTicket={deleteIndvTicket}
                  />
                );
              })}
            </div>
          </div>
        )
    }
    </>
  );
};

export default Board;
